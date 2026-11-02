"""Derive smooth outer envelopes from the converted fsaverage5 surfaces.
Run after convert-brain.py; requires numpy and scipy. Normals and planes are
retained so the viewer can scatter interior neural-network points deterministically.
"""
from pathlib import Path
import json
import numpy as np
from scipy.spatial import ConvexHull
root=Path(__file__).resolve().parents[1]
meta=json.loads((root/'assets/brain-surface.json').read_text())
data=(root/'assets/brain-surface.bin').read_bytes()
parts=[]
for part in meta['hemispheres']:
 points=np.frombuffer(data,dtype='<f4',count=part['vertexCount']*3,offset=part['positionOffset']).reshape(-1,3)
 hull=ConvexHull(points)
 vertices=points[hull.vertices]
 remap={old:i for i,old in enumerate(hull.vertices)}
 faces=[]
 for tri,plane in zip(hull.simplices,hull.equations):
  a,b,c=points[tri]
  if np.dot(np.cross(b-a,c-a),plane[:3])<0: tri=tri[[0,2,1]]
  faces.extend(remap[i] for i in tri)
 # Subdivide and gently smooth the convex boundary for a continuous rim.
 smooth_vertices=vertices.tolist();smooth_faces=[];midpoints={}
 def midpoint(a,b):
  key=tuple(sorted((a,b)))
  if key not in midpoints:
   midpoints[key]=len(smooth_vertices)
   smooth_vertices.append(((vertices[a]+vertices[b])/2).tolist())
  return midpoints[key]
 for a,b,c in np.array(faces).reshape(-1,3):
  ab,bc,ca=midpoint(a,b),midpoint(b,c),midpoint(c,a)
  smooth_faces.extend([[a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]])
 adjacency=[set() for _ in smooth_vertices]
 for tri in smooth_faces:
  for a in tri:
   adjacency[a].update(b for b in tri if b!=a)
 smoothed=np.array(smooth_vertices)
 for _ in range(5):
  average=np.array([smoothed[list(n)].mean(axis=0) for n in adjacency])
  smoothed=smoothed*.82+average*.18
 smoothed=(smoothed-smoothed.mean(axis=0))*1.008+smoothed.mean(axis=0)
 parts.append({'side':part['side'],'positions':smoothed.round(6).flatten().tolist(),'indices':np.array(smooth_faces).flatten().tolist(),'planes':hull.equations.round(6).tolist(),'min':vertices.min(axis=0).tolist(),'max':vertices.max(axis=0).tolist()})
 print(part['side'],len(vertices),'envelope vertices')
(root/'assets/brain-envelope.json').write_text(json.dumps(parts,separators=(',',':'))+'\n')
