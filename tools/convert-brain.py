"""Convert FreeSurfer fsaverage5 pial GIFTI surfaces from Nilearn 0.12.1.
Usage: python tools/convert-brain.py SOURCE_DIR
Requires numpy, nibabel. Produces assets/brain-surface.bin and metadata.
Modified from original: center, RAS->Y-up orientation, uniform scaling, binary format.
"""
import json, sys
from pathlib import Path
import nibabel as nib
import numpy as np
root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
surfaces = [nib.load(source / f'pial_{side}.gii.gz').agg_data() for side in ('left','right')]
raw = np.concatenate([surface[0] for surface in surfaces])
center = (raw.min(axis=0)+raw.max(axis=0))/2
scale = 60.0
chunks=[]; meta={'format':1,'source':'FreeSurfer fsaverage5 via Nilearn 0.12.1','hemispheres':[]}
offset=0
for side,(positions,faces) in zip(('left','right'),surfaces):
 p=(positions-center)/scale
 p=p[:,[0,2,1]];p[:,2]*=-1
 positions=p.astype('<f4');indices=faces.astype('<u4')
 meta['hemispheres'].append({'side':side,'vertexCount':len(p),'faceCount':len(faces),'positionOffset':offset,'indexOffset':offset+positions.nbytes})
 chunks.extend([positions.tobytes(),indices.tobytes()]);offset+=positions.nbytes+indices.nbytes
 print(side, 'vertices',len(p),'faces',len(faces),'bounds',p.min(axis=0),p.max(axis=0))
(root/'assets/brain-surface.bin').write_bytes(b''.join(chunks))
(root/'assets/brain-surface.json').write_text(json.dumps(meta,indent=2)+'\n')
