---
title: "Arc"
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

The Arc class represents a sector mark that is used in a [Doughnut Chart](../../../gallery.html#DoughnutChart) and a [Sunburst Chart](../../../gallery.html#Sunburst). This class is also used to represent a pie mark that is used in a [pie chart](../../../gallery.html#PieChart). A pie is a special arc where the inner radius is 0. To create an Arc object, use the _mark_ method in the [Scene](../../group/scene) class, for example:

```js
    let arc = scene.mark("arc", {x: 100, y: 100, innerRadius: 20, outerRadius: 40, startAngle: 0, endAngle: 90});
```

You can also use the [_divide_ operation](../../operations/generative/#mscdivideelem-data-params) to transform a [Ring](../ringpath/) to a collection of Arc objects, or transform a [Circle](../circlepath/) to a collection of pie marks. [Here is an explanation](../../../tutorials/join/#divide) of the divide operation.

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**angle** <img width="70px" src="../../readonly.png"> | the angle between the start angle and the end angle in degrees | Number | 90 |
|**direction** <img width="70px" src="../../readonly.png"> | the direction in which the arc is drawn | String | "anti-clockwise" |
|**endAngle** <img width="70px" src="../../readonly.png"> | the end angle of the arc in degrees | Number | 90 |
|**innerRadius** <img width="70px" src="../../readonly.png"> | the inner radius of the arc | Number | 100 |
|**outerRadius** <img width="70px" src="../../readonly.png"> | the outer radius of the arc | Number | 200 |
|**startAngle** <img width="70px" src="../../readonly.png"> | the start angle of the arc in degrees | Number | 0 |
|**thickness** <img width="70px" src="../../readonly.png"> | the difference between the outer radius and inner radius | Number | 100 |
|**x** <img width="70px" src="../../readonly.png"> | the x coordinate of the center of the arc | Number | 100 |
|**y** <img width="70px" src="../../readonly.png"> | the y coordinate of the center of the arc | Number | 100 |
{.table-striped}

Angles in Mascot are specified using the polar coordinate system, where 0 is at the positive x axis, and the angle increases in the counterclockwise direction. The figure below illustrates various values of startAngle and endAngle.

{{< figure src="../arc.png" width="850px" alt="start angle and end angle for an arc" caption="" class="border-0 mx-auto text-center">}}

The same applies to a pie mark as well:

{{< figure src="../pie.png" width="700px" alt="start angle and end angle for a pie" caption="" class="border-0 mx-auto text-center">}}

### Properties inherited from Path
| property |  explanation  | type | default value |
| --- | --- | --- | --- |
|**firstSegment** <img width="70px" src="../../readonly.png"> | returns the first segment of the path | [Segment](../../basic/segment/) | |
|**firstVertex** <img width="70px" src="../../readonly.png">| returns the first vertex of the path | [Vertex](../../basic/vertex/) | |
|**segments** <img width="70px" src="../../readonly.png"> | the segments on the path | Array of [Segment](../../basic/segment/) | |
|**vertices** <img width="70px" src="../../readonly.png">| the vertices along the path | Array of [Vertex](../../basic/vertex/) | |
|**vxFillColor**| the fill color of the vertices on this path | Color | "#555555" |
|**vxHeight**| the height of the vertices on this path | Number | 0 |
|**vxOpacity**| the opacity of the vertices on this path | Number | 1 |
|**vxRadius**| the radius of the vertices on this path if the shape is "circle" | Number | 0 |
|**vxShape**| the shape of the vertices on this path<br>possible values: "rect", "circle" | String | undefined |
|**vxStrokeColor** | the stroke color of the vertices on this path | Color | "#aaaaaa" |
|**vxStrokeWidth** | the stroke width of the vertices on this path in pixels | Number | 0 |
|**vxWidth**| the width of the vertices on this path | Number | 0 |
{.table-striped}

### Properties inherited from Mark
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the mark | [Rectangle](../../basic/rectangle/) | |
|**dataScope**| the [data scope](../../data/datascope/) of the mark | [DataScope](../../data/datascope/) | undefined |
|**fillColor**| the fill color of the mark | Color | "none" |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the mark | String | |
|**opacity** | the opacity value of the mark (between 0 and 1) | Number | 1 |
|**strokeColor** | the stroke color of the mark | Color | "#ccc" |
|**strokeDash** | the dashes and gaps for the mark stroke | String | "none" |
|**strokeWidth** | the stroke width of the mark in pixels | Number | 1 |
|**type** <img width="70px" src="../../readonly.png"> | the type of the mark ("arc" or "pie" when innerRadius is 0) | String | "arc" |
|**visibility**| whether the mark is visible ("visible" or "hidden") | String | "visible" |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **getSVGPathData**() | returns a string to be used as the d parameter in an SVG path element | String |
| **setAngles**(startAngle, endAngle) | set the start angle and the end angle<br>startAngle (Number): start angle in degrees<br>endAngle (Number): end angle in degrees | void |
{.table-striped}
