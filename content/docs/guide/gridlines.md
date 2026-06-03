---
title: "Gridlines"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "guide"
weight: 750
toc: true
---

<span style="font-size:1.2em">extends [Path](../../marks/path/)</span><br>

The Gridlines class represents a set of grid lines for a visual encoding. To create a Gridlines object, use the [_gridlines_ method](../../group/scene/#methods-create-guides) in the [Scene](../../group/scene/) class, for example:

    let gridlines = scene.gridlines("x", "metric");

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**attribute** <img width="70px" src="../../readonly.png">| the data attribute represented by the grid lines | String | |
|**channel** <img width="70px" src="../../readonly.png">| the visual channel of the grid lines<br>possible values include "x", "y", "width", "height", and "radialDistance" | String | |
|**elements** <img width="70px" src="../../readonly.png">| the elements used to construct the grid lines | Array | |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the gridlines | String | |
|**lines**| the individual grid line definitions used to render the guide | Array | [] |
|**scale** <img width="70px" src="../../readonly.png">| the scale used to compute the grid line positions | [Scale](../../encode/scale/) | |
|**type** <img width="70px" src="../../readonly.png"> | the type of the gridlines | String | "gridlines" |
|**values**| the data values represented by the grid lines<br>if not provided, Mascot will auto-generate values | Array | |
{.table-striped}

### Properties inherited from Path
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the gridlines | [Rectangle](../../basic/rectangle/) | |
|**fillColor**| the fill color of the gridlines path | Color | "none" |
|**opacity**| the opacity value of the gridlines (between 0 and 1) | Number | 0.5 |
|**strokeColor**| the stroke color of the gridlines | Color | "#ddd" |
|**strokeDash**| the dashes and gaps for the gridlines stroke | String | "none" |
|**strokeWidth**| the stroke width of the gridlines in pixels | Number | 1 |
|**x** <img width="70px" src="../../readonly.png">| the x coordinate of the center of the gridlines bounds | Number | |
|**y** <img width="70px" src="../../readonly.png">| the y coordinate of the center of the gridlines bounds | Number | |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **getSVGPathData**() | returns a string to be used as the `d` parameter in an SVG path element | String |
{.table-striped}
