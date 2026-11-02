import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';

const modelURL = new URL('./assets/brain-surface.bin', import.meta.url);
const metaURL = new URL('./assets/brain-surface.json', import.meta.url);
const envelopeURL = new URL('./assets/brain-envelope.json', import.meta.url);
let modelPromise;
let rememberedCamera;
const defaultCamera = [6.2, 1.6, -4.1];


function loadSurface() {
  if (!modelPromise) modelPromise = Promise.all([fetch(metaURL).then(r=>{if(!r.ok)throw Error('model metadata');return r.json()}), fetch(modelURL).then(r=>{if(!r.ok)throw Error('model surface');return r.arrayBuffer()}), fetch(envelopeURL).then(r=>{if(!r.ok)throw Error('brain envelope');return r.json()})]).catch(e=>{modelPromise=null;throw e});
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
    renderer.shadowMap.enabled=false;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-label','뇌의 윤곽 안에 연결망이 퍼져 있는 3D 개념 지도. 드래그로 회전, 두 손가락 또는 휠로 확대할 수 있습니다.');
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

    const ring=new THREE.Mesh(new THREE.RingGeometry(2.35,2.36,96),new THREE.MeshBasicMaterial({color:0xaccbd5,transparent:true,opacity:.35,side:THREE.DoubleSide}));
    ring.rotation.x=-Math.PI/2;ring.position.y=-2.11;scene.add(ring);
    const brain=new THREE.Group();scene.add(brain);
    const [metadata,buffer,envelopes]=await loadSurface();
    if(disposed)return;
    const outlineMaterial=()=>new THREE.ShaderMaterial({
      transparent:true,depthWrite:false,side:THREE.FrontSide,
      uniforms:{color:{value:new THREE.Color(0x2194b7)}},
      vertexShader:`varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.0);n=normalize(normalMatrix*normal);v=-p.xyz;gl_Position=projectionMatrix*p;}`,
      fragmentShader:`uniform vec3 color;varying vec3 n;varying vec3 v;void main(){float rim=1.0-abs(dot(normalize(n),normalize(v)));float a=smoothstep(.80,.99,rim)*.55;if(a<.015)discard;gl_FragColor=vec4(color,a);}`
    });
    const geometries=[];
    for(const [partIndex,part] of metadata.hemispheres.entries()){
      const geometry=new THREE.BufferGeometry();
      const positions=new Float32Array(buffer.slice(part.positionOffset,part.positionOffset+part.vertexCount*12));
      geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer.slice(part.indexOffset,part.indexOffset+part.faceCount*12)),1));
      geometry.computeVertexNormals();geometry.computeBoundingSphere();
      geometries.push(geometry);
      const envelope=envelopes[partIndex];
      const shellGeometry=new THREE.BufferGeometry();
      shellGeometry.setAttribute('position',new THREE.Float32BufferAttribute(envelope.positions,3));
      shellGeometry.setIndex(envelope.indices);shellGeometry.computeVertexNormals();
      const mesh=new THREE.Mesh(shellGeometry,outlineMaterial());mesh.renderOrder=3;
      brain.add(mesh);
    }
    // fsaverage contains the cerebral cortex. These auxiliary parts are stylized,
    // independently generated shapes that complete the whole-brain silhouette.
    for(const side of [-1,1]){
      const geo=new THREE.SphereGeometry(1,64,48);
      const positions=geo.attributes.position;
      for(let i=0;i<positions.count;i++){
        const v=new THREE.Vector3().fromBufferAttribute(positions,i);
        const fold=1;
        positions.setXYZ(i,side*.39+v.x*.58*fold,-.87+v.y*.40*fold,.83+v.z*.52*fold);
      }
      geo.computeVertexNormals();
      const mesh=new THREE.Mesh(geo,outlineMaterial());
      mesh.castShadow=true;mesh.receiveShadow=true;brain.add(mesh);
    }
    const stem=new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(0,-1.84),new THREE.Vector2(.10,-1.84),new THREE.Vector2(.13,-1.68),new THREE.Vector2(.18,-1.52),new THREE.Vector2(.27,-1.28),new THREE.Vector2(.32,-1.05),new THREE.Vector2(.19,-.81),new THREE.Vector2(0,-.81)],40),outlineMaterial());
    stem.position.z=.30;stem.rotation.x=-.13;stem.castShadow=true;brain.add(stem);

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
      picked.push(best.clone());const p=best.clone().multiplyScalar(.68+(i%3)*.08);coords[placementOrder[i].id]=p;
    }
    const dotGeo=new THREE.SphereGeometry(.025,12,8);
    const glowCanvas=document.createElement('canvas');glowCanvas.width=64;glowCanvas.height=64;
    const ctx=glowCanvas.getContext('2d'),g=ctx.createRadialGradient(32,32,1,32,32,32);g.addColorStop(0,'rgba(175,255,247,.95)');g.addColorStop(.25,'rgba(55,240,255,.5)');g.addColorStop(1,'rgba(0,160,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);
    const glowTexture=new THREE.CanvasTexture(glowCanvas);
    concepts.forEach(c=>{
      const chosen=c.id===selected;
      const dot=new THREE.Mesh(dotGeo.clone(),new THREE.MeshBasicMaterial({color:chosen?0xc2334e:0x087f9d}));dot.position.copy(coords[c.id]);dot.userData.concept=c;nodeGroup.add(dot);
      const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture.clone(),color:chosen?0xffba99:0x77fff1,transparent:true,depthWrite:false}));glow.position.copy(dot.position);glow.scale.setScalar(chosen?.23:.15);nodeGroup.add(glow);
      const label=document.createElement('a');label.href=`#map/${c.id}`;label.className='brain-dot-label'+(chosen?' selected':'');label.textContent=c.name;labels.append(label);
      markers.push({dot,label,position:dot.position,c,chosen});
    });
    dotGeo.dispose();glowTexture.dispose();
    edges.filter(e=>e[0]===selected||e[1]===selected).forEach(([a,b])=>{
      const start=coords[a],end=coords[b];const middle=start.clone().add(end).multiplyScalar(.5);middle.addScaledVector(middle.clone().normalize(),.1);
      const curve=new THREE.QuadraticBezierCurve3(start,middle,end);
      const geo=new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
      connectionGroup.add(new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x8a2342,transparent:true,opacity:.85})));
    });
    // Deterministic interior points and local links create a volumetric network.
    let seed=13271;
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
    const netPoints=[];
    for(const envelope of envelopes){
      let count=0;
      for(let attempt=0;attempt<10000 && count<180;attempt++){
        const p=envelope.min.map((min,k)=>min+random()*(envelope.max[k]-min));
        if(envelope.planes.every(e=>e[0]*p[0]+e[1]*p[1]+e[2]*p[2]+e[3]<-.025)){netPoints.push(new THREE.Vector3(...p));count++}
      }
    }
    for(const side of [-1,1])for(let i=0;i<45;i++){
      let v;do{v=new THREE.Vector3(random()*2-1,random()*2-1,random()*2-1)}while(v.lengthSq()>1);
      netPoints.push(new THREE.Vector3(side*.39+v.x*.55,-.87+v.y*.37,.83+v.z*.49));
    }
    for(let i=0;i<18;i++)netPoints.push(new THREE.Vector3((random()-.5)*.17,-1.8+random()*.85,.46+(random()-.5)*.16));
    const links=[];const used=new Set();
    netPoints.forEach((p,i)=>{
      const neighbours=netPoints.map((q,j)=>({j,d:p.distanceToSquared(q)})).filter(x=>x.j!==i && x.d<.3).sort((a,b)=>a.d-b.d).slice(0,3);
      neighbours.forEach(({j})=>{const key=[Math.min(i,j),Math.max(i,j)].join(':');if(!used.has(key)){used.add(key);links.push(p,netPoints[j])}});
    });
    brain.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(links),new THREE.LineBasicMaterial({color:0x2499b6,transparent:true,opacity:.38,depthWrite:false})));
    const netGeo=new THREE.BufferGeometry().setFromPoints(netPoints);
    brain.add(new THREE.Points(netGeo,new THREE.PointsMaterial({color:0x11a9b4,size:.025,transparent:true,opacity:.8,depthWrite:false})));
    // Source geometries are only used to arrange concept points; the envelope renders.
    geometries.forEach(g=>g.dispose());

    let hover=null;let showConcepts=true;
    const intersect=e=>{
      const r=renderer.domElement.getBoundingClientRect();
      // Larger screen-space targets make the small, visible interior dots tappable.
      let nearest=null,distance=22;
      markers.forEach(m=>{
        const p=m.position.clone().project(camera);if(p.z>1)return;
        const d=Math.hypot((p.x+1)*r.width/2-(e.clientX-r.left),(1-p.y)*r.height/2-(e.clientY-r.top));
        if(d<distance){distance=d;nearest=m}
      });return nearest;
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
    const projected=new THREE.Vector3();
    function draw(){
      if(disposed)return;
      controls.update();if(!dirty){frame=requestAnimationFrame(draw);return}dirty=false;ring.visible=camera.position.y>-.9;
      scene.updateMatrixWorld();
      // The open outline leaves interior concepts visible from every angle.
      for(const m of markers){

        projected.copy(m.position).project(camera);
        const visible=projected.z<1 && (m.chosen||hover===m);
        m.label.hidden=!visible;m.label.style.left=`${(projected.x+1)*50}%`;m.label.style.top=`${(1-projected.y)*50}%`;
      }
      renderer.render(scene,camera);frame=requestAnimationFrame(draw);
    }
    draw();
  }
}
