---
title: "Area"
description: ""
lead: ""
date: 2020-11-12T15:22:20+01:00
lastmod: 2020-11-12T15:22:20+01:00
draft: false
images: []
menu: 
  docs:
    parent: "marks"
weight: 45
toc: true
---

<span style="font-size:1.2em">extends [Path](../path/)</span><br>

The Area class represents an enclosed area mark that is used in visualizations such as the [area chart](../../../gallery.html#AreaChart) and the [violin plot](../../../gallery.html#ViolinPlot). You cannot create an Area object directly, instead, you need to use the [_densify_ method](../../group/scene/#methods-join-graphics-with-data) in the [Scene](../../group/scene) class to transform a [Rect](../rectpath/) to an Area. [Here is an explanation](../../../tutorials/join/#densify) of the densify operation. The figure below shows how Area objects are created from a Rect object through the densify operation.

{{< figure src="../area.png" width="500px" alt="Area" caption="" class="border-0 mx-auto text-center" >}}


### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**width** <img width="70px" src="../../readonly.png">| the width of the area | Number |  | 
|**height** <img width="70px" src="../../readonly.png">| the height of the area | Number |  | 
|**left** <img width="70px" src="../../readonly.png">| the x coordinate of the first vertex | Number |  | 
|**top** <img width="70px" src="../../readonly.png">| the y coordinate of the first vertex | Number |  | 
|**orientation**| the orientation of the area | String |  |
|**baseline** | the [anchor](../../global/constants/#anchor) used to evenly distribute the width or height of the area | String |  | 
|**firstVertexPair** <img width="70px" src="../../readonly.png">| the first pair of the vertices (highlighted in red in the figure above) | Array of [Vertex](../../basic/vertex/) |  | 
{.table-striped}


### Properties inherited from Path
| property |  explanation  | type | default value |
| --- | --- | --- | --- |
|**x** <img width="70px" src="../../readonly.png">| the x coordinate of the center of the path bounds | Number | |
|**y** <img width="70px" src="../../readonly.png">| the y coordinate of the center of the path bounds | Number | |
|**curveMode**| how the segments are drawn  | String | |
|**vertices** <img width="70px" src="../../readonly.png">| the vertices along the path | Array |  | 
|**segments** <img width="70px" src="../../readonly.png"> | the segments on the path | Array | | 
|**firstVertex** <img width="70px" src="../../readonly.png">| returns the first vertex of the path | [Vertex](../../basic/vertex/) |
|**firstSegment** <img width="70px" src="../../readonly.png"> | returns the first segment of the path | [Segment](../../basic/segment/) |
|**vxShape**| the shape of the vertices on this path<br>possible values: "rect", "circle" | String | undefined | 
|**vxWidth**| the width of the vertices on this path | Number | 0 | 
|**vxHeight**| the height of the vertices on this path | Number | 0 |
|**vxRadius**| the radius of the vertices on this path if the shape is "circle" | Number | 0 |  
|**vxFillColor**| the fill color of the vertices on this path | Color | "#555555" |
|**vxStrokeColor** | the stroke color of the vertices on this path | Color | "#aaaaaa" |
|**vxStrokeWidth** | the stroke width of the vertices on this path in pixels | Number | 0 | 
|**vxOpacity** | the opacity of the vertices on this path | Number | 1 | 
{.table-striped}

### Properties inherited from Mark
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the mark | String |  |
|**type** <img width="70px" src="../../readonly.png"> | the type of the mark | String | "area" |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the mark | [Rectangle](../../basic/rectangle/) | |
|**dataScope**| the [data scope](../../data/datascope/) of the mark | [DataScope](../../data/datascope/) | undefined |
|**fillColor**| the fill color of the mark | Color | "none" |
|**strokeColor** | the stroke color of the mark | Color | "#ccc" |
|**strokeDash** | the dashes and gaps for the mark stroke | String | "none" |
|**strokeWidth** | the stroke width of the mark in pixels | Number | 1 |
|**opacity** | the opacity value of the mark (between 0 and 1) | Number | 1 |
|**visibility**| whether the mark is visible ("visible" or "hidden") | String | "visible" |
{.table-striped}

### Methods inherited from Path
| method |  explanation   | return type |
| ---- | --- | --- |
| **resize**(wd, ht, xRef, yRef) | change the width and height of the area<br>wd (Number): width<br>ht (Number): height<br>xRef (String, optional): horizontal reference point<br>yRef (String, optional): vertical reference point | void |
| **getSVGPathData**() | returns a string to be used as the d parameter in an SVG path element | String |
{.table-striped}
