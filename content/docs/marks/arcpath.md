---
title: "ArcPath"
description: ""
lead: ""
date: 2020-11-12T15:22:20+01:00
lastmod: 2020-11-12T15:22:20+01:00
draft: false
images: []
menu: 
  docs:
    parent: "marks"
weight: 48
toc: true
---

<span style="font-size:1.2em">extends [Path](../path/)</span><br>

The ArcPath class represents a sector mark that is used in a [Doughnut Chart](../../../gallery.html#DoughnutChart) and a [Sunburst Chart](../../../gallery.html#Sunburst). This class is also used to represent a pie mark that is used in a [pie chart](../../../gallery.html#PieChart). A pie is a special arc where the inner radius is 0. You cannot create an ArcPath object directly, instead, you need to use the [_divide_ method](../../group/scene/#methods-join-graphics-with-data) in the [Scene](../../group/scene) class to transform a [RingPath](../ringpath/) to a collection of ArcPath objects (or transform a [CirclePath](../ringpath/) to a collection of pie marks). [Here is an explanation](../../../tutorials/join/#divide) of the divide operation. 


### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**innerRadius** | the inner radius of the arc | Number | 100 | 
|**outerRadius** | the outer radius of the arc | Number | 200 | 
|**startAngle** | the start angle of the arc in degrees | Number | 0 | 
|**endAngle** | the end angle of the arc in degrees | Number | 90 | 
|**angle** <img width="70px" src="../../readonly.png"> | the angle between the start angle and the end angle in degrees | Number | 90 | 
|**thickness** <img width="70px" src="../../readonly.png"> | the difference between the outer radius and inner radius | Number | 100 | 
{.table-striped}

Angles in Mascot are specified using the polar coordinate system, where 0 is at the positive x axis, and the angle increases in the counterclockwise direction. The figure below illustrates various values of startAngle and endAngle.

{{< figure src="../arc.png" width="850px" alt="start angle and end angle for an arc" caption="" class="border-0 mx-auto text-center">}}

The same applies to a pie mark as well:

{{< figure src="../pie.png" width="700px" alt="start angle and end angle for a pie" caption="" class="border-0 mx-auto text-center">}}


### Properties inherited from Path
| property |  explanation  | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the path | [Rectangle](../../basic/rectangle/) | |
|**x** | the x coordinate of the center of the arc | Number | 0 |
|**y** | the y coordinate of the center of the arc | Number | 0 |
|**vertices** <img width="70px" src="../../readonly.png">| the vertices along the path | Array |  | 
|**segments** <img width="70px" src="../../readonly.png"> | the segments on the path | Array | | 
|**firstVertex** <img width="70px" src="../../readonly.png">| returns the first vertex of the path | [Vertex](../../basic/vertex/) |
|**firstSegment** <img width="70px" src="../../readonly.png"> | returns the first segment of the path | [Segment](../../basic/segment/) |
|**fillColor**| the fill color of the path if it is closed | Color | undefined | 
|**strokeColor** | the stroke color of the path | Color | "#ccc" | 
|**strokeDash** | the dashes and gaps for the path stroke | String | "none" | 
|**strokeWidth** | the stroke width of the path in pixels | Number | 1| 
|**opacity** | the opacity value of the path (between 0 and 1) | Number | 1 |
|**vxShape**| the shape of the vertices on this path<br>possible values: "rect", "circle" | String | undefined | 
|**vxWidth**| the width of the vertices on this path | Number | 0 | 
|**vxHeight**| the height of the vertices on this path | Number | 0 |
|**vxRadius**| the radius of the vertices on this path if the shape is "circle" | Number | 0 |  
|**vxFillColor**| the fill color of the vertices on this path | Color | "#555" | 
|**vxStrokeColor** | the stroke color of the vertices on this path | Color | "#aaa" | 
|**vxStrokeWidth** | the stroke width of the vertices on this path in pixels | Number | 0 | 
|**vxOpacity** | the opacity of the vertices on this path | Number | 1 | 
{.table-striped}

### Properties inherited from Mark
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the path | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the path | String | "circle" | 
|**dataScope**| the [data scope](../../data/datascope/) of the path | [DataScope](../../data/datascope/) | undefined |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **adjustAngle**(start, end) | set the start angle and the end angle<br>start (Number): start angle in degrees<br>end (Number): end angle in degrees |  |
| **sweepOver**(arc) | returns if the angle of this arc contains the angle of the argument arc<br>arc ([ArcPath](../arcpath/)): argument arc | Boolean |
{.table-striped}

### Methods inherited from Path
| method |  explanation   | return type |
| ---- | --- | --- |
| **getSVGPathData**() | returns a string to be used as the d parameter in an SVG path element | String |
{.table-striped}

### Methods inherited from Mark
| method |  explanation   | return type |
| --- | --- | --- |
| **contains**(x, y) | whether this mark contains a point<br>x (Number): x coordinate of the point<br>y (Number): y coordinate of the point | Boolean |
| **getScene**() | returns the scene in which this mark resides | [Scene](../../group/scene) |
| **duplicate**() | returns a copy of this mark | [ArcPath](../arcpath/) | 
{.table-striped}