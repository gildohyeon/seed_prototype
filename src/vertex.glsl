#include <begin_vertex>

/* transformed.y += 0.02; */


float mask_bud_outer = clamp(map(color.x,0.5,0.6,0.0,1.0),0.0,1.0);
float mask_bud_inner = clamp(map(color.x,0.4,0.5,0.0,1.0),0.0,1.0) - clamp(map(color.x,0.5,0.6,0.0,1.0),0.0,1.0);
float mask_stamen_ring = clamp(map(color.x,0.3,0.4,0.0,1.0),0.0,1.0) - clamp(map(color.x,0.4,0.5,0.0,1.0),0.0,1.0);
float mask_stamen_top = clamp(map(color.x,0.2,0.3,0.0,1.0),0.0,1.0) - clamp(map(color.x,0.3,0.4,0.0,1.0),0.0,1.0);
float mask_stamen_center = clamp(map(color.x,0.1,0.2,0.0,1.0),0.0,1.0) - clamp(map(color.x,0.2,0.3,0.0,1.0),0.0,1.0);
float mask_petal = clamp(map(color.x,0.0,0.1,0.0,1.0),0.0,1.0) - clamp(map(color.x,0.1,0.2,0.0,1.0),0.0,1.0);



/* petal */

float petal_gradient_z = pow(1.0-(uv.y*2.0),3.0);

transformed.z = transformed.z - petal_gradient_z*0.05*mask_petal;

transformed.z = transformed.z + (abs((uv.x*2.0)*2.0 - 1.0)*0.02)*mask_petal;

/* stamen_top */

float stamen_top_gradient = pow(1.0-(uv.y*2.0),3.0);

transformed.y = transformed.y - stamen_top_gradient*0.01*mask_stamen_top;


vColor = vec3(1.0,1.0,1.0);