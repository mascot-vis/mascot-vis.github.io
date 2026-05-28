---
title: "Vertex"
description: ""
lead: ""
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "basic"
weight: 10
toc: true
---

The Vertex class represents a vertex (sometimes called an anchor point) in a [path](../../marks/path/). For example, a triangle has three vertices; a rectangle has four vertices. A vertex can have its own visual styles such as geometric shape, fill color and size. By default, a vertex is invisible (width and height set to 0). 

Vertices are automatically created when their parent path objects are instantiated. For rectangles and circles, the positions of the vertices are set automatically based on the top, left, width and height parameters of the [Rect](../../marks/rectpath/), or the x, y and radius parameters of the [CirclePath](../../marks/circlepath/). For lines, you can specify the positions of the start and end vertices as x1, y1, x2, y2 parameters. For polyline, you can specify the positions of the vertices as the vertices parameter. The API reference for [Path](../../marks/path/) contains some examples. You can also manually add a vertex, using the _addVertex_ method in the [Path](../../marks/path/) class.

The properties of a vertex can be set individually. You can also set the properties of all the vertices on a path through the following path properties: [vxShape, vxWidth, vxHeight, vxRadius, vxFillColor, vxStrokeColor, vxStrokeWidth, vxOpacity](../../marks/path/#properties).

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the vertex | [Rectangle](../rectangle/)  |
|**dataScope**| the [data scope](../../data/datascope/) of the vertex | [DataScope](../../data/datascope/) | undefined |
|**fillColor** | the fill color of the vertex shape | Color | "#555" |
|**height** | the height of the vertex shape | Number | 0 |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the vertex | String |  | 
|**opacity** | the opacity of the vertex shape | Number | 1 |
|**parent** <img width="70px" src="../../readonly.png">| the parent mark of the vertex | [Path](../../mark/path/) | |
|**radius** | the radius of the vertex if the shape is "circle" | Number | 0 |
|**shape** | the shape of the vertex, currently supporting "**rect**" and "**circle**" | String | undefined |
|**strokeColor** | the stroke color of the vertex shape | Color | "#aaa" |
|**strokeWidth** | the stroke width of the vertex shape | Number | 0 |
|**type** <img width="70px" src="../../readonly.png"> | the type of the vertex | String | "vertex" | 
|**width** | the width of the vertex shape | Number | 0 |
|**x**| the x coordinate of the vertex center | Number | 0 | 
|**y**| the y coordinate of the vertex center | Number | 0 | 
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| *none* |  |  |
{.table-striped}
<!-- | **clone**() | returns a copy of this vertex | [Vertex](../vertex/) | -->

