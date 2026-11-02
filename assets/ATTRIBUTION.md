# 3D brain model credits

The cerebral cortical surfaces are based on **FreeSurfer fsaverage5**, distributed
in Nilearn 0.12.1 (`pial_left.gii.gz`, `pial_right.gii.gz`). Each hemisphere has
10,242 vertices and 20,480 triangles. This is an average template surface, not a
model of a particular learner's brain.

Source: https://github.com/nilearn/nilearn/tree/0.12.1/nilearn/datasets/data/fsaverage5
FreeSurfer: https://surfer.nmr.mgh.harvard.edu/
Reference: Fischl et al. (1999), High-resolution intersubject averaging and a
coordinate system for the cortical surface. https://doi.org/10.1002/(SICI)1097-0193(1999)8:4%3C272::AID-HBM10%3E3.0.CO;2-4

This is a **modified version**: coordinates have been centered, rotated into
Y-up coordinates, uniformly scaled and converted to little-endian binary arrays.
The converter is `tools/convert-brain.py`. Colors, learning markers, connections,
and the stylized cerebellum and brainstem are added by this project; the latter
are illustrative geometry, not parts of the source anatomical data.

All or portions of this licensed product (such portions are the "Software") have
been obtained under license from The General Hospital Corporation "MGH" and are
subject to the terms and conditions in [FREESURFER-LICENSE.txt](FREESURFER-LICENSE.txt).

Nilearn's distribution license: [NILEARN-LICENSE.txt](NILEARN-LICENSE.txt).
Rendering uses Three.js 0.180.0 and OrbitControls, under the
[MIT license](../vendor/THREE-LICENSE.txt).

The current viewer derives a convex outer envelope for each hemisphere, subdivides
and smooths it, and renders only its rim. `tools/derive-envelope.py` reproduces
this derivative. Interior points and network links are generated illustrations,
not anatomical connectivity or measured neurons.
