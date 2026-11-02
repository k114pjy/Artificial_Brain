import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';

const modelURL = new URL('./assets/brain-surface.bin', import.meta.url);
const metaURL = new URL('./assets/brain-surface.json', import.meta.url);
let modelPromise;
let rememberedCamera;
const defaultCamera = [4.8, 2.1, -5.6];


function loadSurface() {
  if (!modelPromise) modelPromise = Promise.all([fetch(metaURL).then(r=>{if(!r.ok)throw Error('model metadata');return r.json()}), fetch(modelURL).then(r=>{if(!r.ok)throw Error('model surface');return r.arrayBuffer()})]).catch(e=>{modelPromise=null;throw e});
  return modelPromise;
}

export function mountBrain(container, concepts, edges, selected) {
  let disposed=false, frame=0, renderer, resizeObserver, controls, scene, dirty=true;
  const abort=new AbortController();
  const stage=container.querySelector('.brain-stage');
  const status=container.querySelector('.brain-status');
  const labels=container.querySelector('.brain-labels');
  const select=container.querySelector('.brain-concept-select');
  const listen=(target,type,callback,options={})=>target.addEventListener(type,callback,{...options,signal:abort.signal});
  const cleanup=()=>{
    disposed=true;abort.abort();cancelAnimationFrame(frame);resizeObserver?.disconnect();
    if(controls && renderer && !renderer.getContext().isContextLost()) rememberedCamera={position:controls.object.position.toArray(),target:controls.target.toArray()};
    controls?.dispose();
    scene?.traverse(o=>{o.geometry?.dispose();for(const material of [].concat(o.material||[])){material.map?.dispose();material.dispose()}});
    renderer?.dispose();renderer?.forceContextLoss();
  };
  const showError=()=>{stage.dataset.state='error';status.hidden=false;status.textContent='3D 화면을 열 수 없어요. WebGL을 지원하는 브라우저에서 다시 열어주세요. 아래 목록에서 개념은 계속 선택할 수 있어요.'};
  listen(select,'change',()=>{location.hash=`#map/${select.value}`});
  init().catch(error=>{if(!disposed){console.error('Brain viewer:',error);showError()}});
  return cleanup;

  async function init(){
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.25;
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-label','실제 대뇌 표면을 사용한 3D 개념 지도. 드래그로 회전, 두 손가락 또는 휠로 확대할 수 있습니다.');
    renderer.domElement.tabIndex=0;
    stage.prepend(renderer.domElement);
    listen(renderer.domElement,'webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);showError()});
    scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(36,1,.1,100);
    camera.position.fromArray(rememberedCamera?.position||defaultCamera);
    controls=new OrbitControls(camera,renderer.domElement);
    controls.target.fromArray(rememberedCamera?.target||[0,-.16,0]);
    controls.enableDamping=true;controls.dampingFactor=.12;
    controls.enablePan=false;controls.minDistance=4.7;controls.maxDistance=12;
    controls.rotateSpeed=.75;controls.zoomSpeed=.65;
    controls.addEventListener('change',()=>{dirty=true});
    controls.update();

    scene.add(new THREE.HemisphereLight(0xe9fbff,0x3d5679,2.5));
    const key=new THREE.DirectionalLight(0xeafaff,4);key.position.set(-3,5,-4);key.castShadow=true;
    key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=4;key.shadow.camera.bottom=-4;key.shadow.bias=-.001;key.shadow.normalBias=.03;scene.add(key);
    const fill=new THREE.DirectionalLight(0x48caff,2);fill.position.set(4,1,3);scene.add(fill);
    const rim=new THREE.DirectionalLight(0x87ffe9,2);rim.position.set(-3,.3,3);scene.add(rim);
    // The faint floor gives a spatial reference; it is hidden for the inferior view.
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(14,14),new THREE.ShadowMaterial({opacity:.13}));
    floor.rotation.x=-Math.PI/2;floor.position.y=-2.12;floor.receiveShadow=true;scene.add(floor);
    const ring=new THREE.Mesh(new THREE.RingGeometry(2.35,2.36,96),new THREE.MeshBasicMaterial({color:0xaccbd5,transparent:true,opacity:.35,side:THREE.DoubleSide}));
    ring.rotation.x=-Math.PI/2;ring.position.y=-2.11;scene.add(ring);
    const brain=new THREE.Group();scene.add(brain);
    const occluders=[];
    const [metadata,buffer]=await loadSurface();
    if(disposed)return;
    const geometries=[];
    for(const part of metadata.hemispheres){
      const geometry=new THREE.BufferGeometry();
      const positions=new Float32Array(buffer.slice(part.positionOffset,part.positionOffset+part.vertexCount*12));
      geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer.slice(part.indexOffset,part.indexOffset+part.faceCount*12)),1));
      geometry.computeVertexNormals();geometry.computeBoundingSphere();
      const material=new THREE.MeshPhysicalMaterial({color:0x1d80b5,roughness:.42,metalness:.12,clearcoat:.25,clearcoatRoughness:.45});
      const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;
      brain.add(mesh);occluders.push(mesh);geometries.push(geometry);
    }
    // fsaverage contains the cerebral cortex. These auxiliary parts are stylized,
    // independently generated shapes that complete the whole-brain silhouette.
    for(const side of [-1,1]){
      const geo=new THREE.SphereGeometry(1,64,48);
      const positions=geo.attributes.position;
      for(let i=0;i<positions.count;i++){
        const v=new THREE.Vector3().fromBufferAttribute(positions,i);
        const folia=v.y+.12*Math.sin(v.x*4)+.08*Math.sin(v.z*5);
        const fold=1+.025*Math.cos(folia*64)+.012*Math.sin(v.x*13+v.z*9);
        positions.setXYZ(i,side*.39+v.x*.58*fold,-.87+v.y*.40*fold,.83+v.z*.52*fold);
      }
      geo.computeVertexNormals();
      const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x327fa3,roughness:.55,metalness:.08}));
      mesh.castShadow=true;mesh.receiveShadow=true;brain.add(mesh);occluders.push(mesh);
    }
    const stem=new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(0,-1.84),new THREE.Vector2(.10,-1.84),new THREE.Vector2(.13,-1.68),new THREE.Vector2(.18,-1.52),new THREE.Vector2(.27,-1.28),new THREE.Vector2(.32,-1.05),new THREE.Vector2(.19,-.81),new THREE.Vector2(0,-.81)],40),new THREE.MeshStandardMaterial({color:0x3c8fb1,roughness:.5}));
    stem.position.z=.30;stem.rotation.x=-.13;stem.castShadow=true;brain.add(stem);occluders.push(stem);

    const nodeGroup=new THREE.Group(), connectionGroup=new THREE.Group();brain.add(connectionGroup,nodeGroup);
    const markers=[];const coords={};
    // Farthest-point sampling spreads concept markers across both hemispheres.
    const candidates=[];
    for(const geometry of geometries){const a=geometry.attributes.position;for(let i=0;i<a.count;i+=9){const v=new THREE.Vector3().fromBufferAttribute(a,i);if(Math.abs(v.x)>.25)candidates.push(v)}}
    const picked=[];
    const placementOrder=[...concepts].sort((a,b)=>(a.id==='gradient'?-1:b.id==='gradient'?1:0));
    for(let i=0;i<placementOrder.length;i++){
      let best,score=-Infinity;
      for(const v of candidates){const distance=picked.length?Math.min(...picked.map(p=>p.distanceToSquared(v))):-v.z+v.x*.7+v.y*.25;if(distance>score){best=v;score=distance}}
      const p=best.clone();picked.push(p);const direction=p.clone().normalize();p.addScaledVector(direction,.055);coords[placementOrder[i].id]=p;
    }
    const dotGeo=new THREE.SphereGeometry(.025,12,8);
    const glowCanvas=document.createElement('canvas');glowCanvas.width=64;glowCanvas.height=64;
    const ctx=glowCanvas.getContext('2d'),g=ctx.createRadialGradient(32,32,1,32,32,32);g.addColorStop(0,'rgba(175,255,247,.95)');g.addColorStop(.25,'rgba(55,240,255,.5)');g.addColorStop(1,'rgba(0,160,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);
    const glowTexture=new THREE.CanvasTexture(glowCanvas);
    concepts.forEach(c=>{
      const chosen=c.id===selected;
      const dot=new THREE.Mesh(dotGeo.clone(),new THREE.MeshBasicMaterial({color:chosen?0xffcdad:0xb7fff4}));dot.position.copy(coords[c.id]);dot.userData.concept=c;nodeGroup.add(dot);
      const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture.clone(),color:chosen?0xffba99:0x77fff1,transparent:true,depthWrite:false}));glow.position.copy(dot.position);glow.scale.setScalar(chosen?.23:.15);nodeGroup.add(glow);
      const label=document.createElement('a');label.href=`#map/${c.id}`;label.className='brain-dot-label'+(chosen?' selected':'');label.textContent=c.name;labels.append(label);
      markers.push({dot,label,position:dot.position,c,chosen});
    });
    dotGeo.dispose();glowTexture.dispose();
    edges.filter(e=>e[0]===selected||e[1]===selected).forEach(([a,b])=>{
      const start=coords[a],end=coords[b];const middle=start.clone().add(end).multiplyScalar(.5);middle.addScaledVector(middle.clone().normalize(),.45);
      const curve=new THREE.QuadraticBezierCurve3(start,middle,end);
      const geo=new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
      connectionGroup.add(new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xa0fff1,transparent:true,opacity:.75})));
    });
    // A sparse surface constellation adds the luminous neural-network appearance.
    const netPoints=[];
    for(let i=0;i<candidates.length;i+=15){const v=candidates[i].clone();v.addScaledVector(v.clone().normalize(),.015);netPoints.push(v)}
    const netGeo=new THREE.BufferGeometry().setFromPoints(netPoints);
    const constellation=new THREE.Points(netGeo,new THREE.PointsMaterial({color:0x91fff3,size:.015,transparent:true,opacity:.45}));brain.add(constellation);

    const raycaster=new THREE.Raycaster();const mouse=new THREE.Vector2();let hover=null;let showConcepts=true;
    const intersect=e=>{const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(mouse,camera);
      // Screen-space targets remain easy to tap while visual points stay small.
      let nearest=null,distance=22;
      markers.forEach(m=>{const p=m.position.clone().project(camera);const d=Math.hypot((p.x+1)*r.width/2-(e.clientX-r.left),(1-p.y)*r.height/2-(e.clientY-r.top));if(d<distance){const toward=m.position.clone().sub(camera.position);const length=toward.length();raycaster.set(camera.position,toward.normalize());raycaster.far=length-.035;const blocked=raycaster.intersectObjects(occluders,false).length>0;raycaster.far=Infinity;if(!blocked){distance=d;nearest=m}}});return nearest;
    };
    let down=null;
    listen(renderer.domElement,'pointerdown',e=>{down={x:e.clientX,y:e.clientY}});
    listen(renderer.domElement,'pointermove',e=>{hover=showConcepts?intersect(e):null;dirty=true;renderer.domElement.style.cursor=hover?'pointer':down?'grabbing':'grab'});
    listen(renderer.domElement,'pointerleave',()=>{hover=null;dirty=true});
    listen(renderer.domElement,'pointerup',e=>{if(down && Math.hypot(e.clientX-down.x,e.clientY-down.y)<6 && showConcepts){const m=intersect(e);if(m)location.hash=`#map/${m.c.id}`}down=null});
    listen(renderer.domElement,'pointercancel',()=>{down=null});
    listen(container.querySelector('[data-reset]'),'click',()=>{controls.target.set(0,-.16,0);camera.position.fromArray(defaultCamera);controls.update();container.dataset.view='perspective'});
    listen(container.querySelector('[data-concepts]'),'change',e=>{showConcepts=e.target.checked;nodeGroup.visible=showConcepts;connectionGroup.visible=showConcepts;labels.hidden=!showConcepts;dirty=true});
    listen(renderer.domElement,'keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const v=camera.position.clone().sub(controls.target),s=new THREE.Spherical().setFromVector3(v);s.theta+=e.key==='ArrowLeft'?-.14:e.key==='ArrowRight'?.14:0;s.phi+=e.key==='ArrowUp'?-.14:e.key==='ArrowDown'?.14:0;s.makeSafe();camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update()});
    resizeObserver=new ResizeObserver(()=>{const width=stage.clientWidth,height=stage.clientHeight;if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);dirty=true});resizeObserver.observe(stage);
    stage.dataset.state='ready';status.hidden=true;
    const projected=new THREE.Vector3();const dir=new THREE.Vector3();
    function draw(){
      if(disposed)return;
      controls.update();if(!dirty){frame=requestAnimationFrame(draw);return}dirty=false;floor.visible=ring.visible=camera.position.y>-.9;
      scene.updateMatrixWorld();
      // Occlusion keeps labels on the hidden side from appearing through the brain.
      for(const m of markers){
        if(m.chosen||hover===m){dir.copy(m.position).sub(camera.position);const distance=dir.length();raycaster.set(camera.position,dir.normalize());raycaster.far=distance-.035;m.occluded=raycaster.intersectObjects(occluders,false).length>0;raycaster.far=Infinity;}
        projected.copy(m.position).project(camera);
        const visible=!m.occluded && projected.z<1 && (m.chosen||hover===m);
        m.label.hidden=!visible;m.label.style.left=`${(projected.x+1)*50}%`;m.label.style.top=`${(1-projected.y)*50}%`;
      }
      renderer.render(scene,camera);frame=requestAnimationFrame(draw);
    }
    draw();
  }
}
