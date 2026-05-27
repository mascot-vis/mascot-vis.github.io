---
title: "Circle"
description: ""
lead: ""
date: 2020-11-12T15:22:20+01:00
lastmod: 2020-11-12T15:22:20+01:00
draft: false
images: []
menu:
  docs:
    parent: "marks"
weight: 40
toc: true
---

<span style="font-size:1.2em">extends [Mark](../mark/)</span><br>

The Circle class represents a circle mark. To create a circle, use the _mark_ method in the [Scene](../../group/scene) class, for example:

```js
    let circle = scene.mark("circle", {x: 50, y: 100, radius: 20});
```

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**x** <img width="70px" src="../../readonly.png">| the x coordinate of the center of the circle | Number | 0 |
|**y** <img width="70px" src="../../readonly.png">| the y coordinate of the center of the circle | Number | 0 |
|**radius** | the radius of the circle | Number | 100 | 
|**area** <img width="70px" src="../../readonly.png">| the area of the circle | Number |  | 
{.table-striped}

### Properties inherited from Mark
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the mark | String |  |
|**type** <img width="70px" src="../../readonly.png"> | the type of the mark | String | "circle" |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the mark | [Rectangle](../../basic/rectangle/) | |
|**dataScope**| the [data scope](../../data/datascope/) of the mark | [DataScope](../../data/datascope/) | undefined |
|**fillColor**| the fill color of the mark | Color | "none" |
|**strokeColor** | the stroke color of the mark | Color | "#ccc" |
|**strokeDash** | the dashes and gaps for the mark stroke | String | "none" |
|**strokeWidth** | the stroke width of the mark in pixels | Number | 1 |
|**opacity** | the opacity of the mark (between 0 and 1) | Number | 1 |
|**visibility**| whether the mark is visible ("visible" or "hidden") | String | "visible" |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **getSVGPathData**() | returns a string to be used as the d parameter in an SVG path element | String |
{.table-striped}
