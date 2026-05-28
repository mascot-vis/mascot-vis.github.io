---
title: "Rectangle"
description: ""
lead: ""
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "basic"
weight: 7
toc: true
---

The Rectangle class represents an abstract rectangular area. It is different from a [rectangle mark](../../mark/rectpath/).

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**bottom** <img width="70px" src="../../readonly.png"> | the y coordinate of the bottom of the rectangle | Number |  | 
|**center** <img width="70px" src="../../readonly.png"> | the x coordinate of the center of the rectangle | Number |  | 
|**height** | the height of the rectangle | Number |  | 
|**left** | the x coordinate of the left hand side of the rectangle | Number |  | 
|**middle** <img width="70px" src="../../readonly.png"> | the y coordinate of the center of the rectangle | Number |  | 
|**right** <img width="70px" src="../../readonly.png"> | the x coordinate of the right hand side of the rectangle | Number |  | 
|**top** | the y coordinate of the top of the rectangle | Number |  | 
|**width** | the width of the rectangle | Number |  | 
|**x** <img width="70px" src="../../readonly.png"> | the x coordinate of the center of the rectangle<br>same as "center" | Number |  | 
|**y** <img width="70px" src="../../readonly.png"> | the y coordinate of the center of the rectangle<br>same as "middle" | Number |  | 
{.table-striped}

### Methods
| method |  explanation  | return type |
| --- | --- | --- |
| **clone**() | returns a copy of this rectangle | [Rectangle](../rectangle/) |
| **contains**(x, y) | check if a point with the specified x and y coordinates (type Number) is inside this rectangle | Boolean |
| **intersects**(r) | returns `true` if this rectangle overlaps with `rect` (type [Rectangle](../rectangle/)) | Boolean |
| **setHeight**(v, ref) | sets the height to v (type Number). Grows/shrinks from the bottom edge by default; pass `BoundsAnchor.TOP` as `ref` to anchor from the top edge, or `BoundsAnchor.MIDDLE` to grow/shrink symmetrically | void |
| **setWidth**(v, ref) | sets the width to v (type Number). Grows/shrinks from the left edge by default; pass `BoundsAnchor.RIGHT` as `ref` to anchor from the right edge, or `BoundsAnchor.CENTER` to grow/shrink symmetrically | void |
| **toJSON**() | returns an object with the rectangle's center coordinates and dimensions: `{ x, y, width, height }` | Object |
| **translate**(dx, dy) | shifts the rectangle by dx (type Number) horizontally and dy (type Number) vertically | void |
| **union**(rect) | returns the union of this rectangle and the parameter `rect` (type [Rectangle](../rectangle/)) | [Rectangle](../rectangle/) |
{.table-striped}