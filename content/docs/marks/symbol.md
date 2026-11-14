---
title: "Symbol"
description: ""
lead: ""
date: 2026-07-31T08:49:31+00:00
lastmod: 2026-07-31T08:49:31+00:00
draft: false
images: []
menu:
  docs:
    parent: "marks"
weight: 52
toc: true
---
<span style="font-size:1.2em">extends [Mark](../mark/)</span><br>

The Symbol class represents an atomic, reusable vector shape/icon. Unlike [Image](../image/), which references an external raster/vector asset via a URL, a Symbol's geometry is inline: a single SVG path string (`path`) authored in its own local coordinate system (`viewBox`). At render time the path is placed at `x`/`y` and scaled to fit `width`/`height`, the same way icon systems (e.g. Material Symbols) render a fixed glyph at different sizes. Note that Symbol currently has no property to pre-rotate its own artwork (e.g. to compensate for an icon authored facing a direction other than straight down, which is what layouts like [CircularLayout](../../layout/circular/)'s `markRotation` assume) -- this may be added back in the future. To create a Symbol object, use the _mark_ method in the [Scene](../../group/scene) class, for example:
```js
    let star = scene.mark("symbol", {x: 50, y: 100, width: 20, height: 20, path: "M12 2 L15 9 L22 9 L16 14 L18 21 L12 17 L6 21 L8 14 L2 9 L9 9 Z", viewBox: [0, 0, 24, 24]});
```

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**height** | the rendered height of the symbol | Number | 24 |
|**path** | the SVG path "d" string describing the symbol's geometry | String | |
|**viewBox** | the [minX, minY, width, height] of the coordinate system the path was authored in | Array | [0, 0, 24, 24] |
|**width** | the rendered width of the symbol | Number | 24 |
|**x** | the x coordinate of the left border of the symbol | Number | 0 |
|**y** | the y coordinate of the top border of the symbol | Number | 0 |
{.table-striped}

### Properties inherited from Mark
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the symbol | [Rectangle](../../basic/rectangle/) | |
|**dataScope**| the [data scope](../../data/datascope/) of the symbol | [DataScope](../../data/datascope/) | undefined |
|**fillColor**| the fill color of the symbol | Color | undefined |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the symbol | String | |
|**opacity** | the opacity value of the symbol (between 0 and 1) | Number | 1 |
|**strokeColor** | the stroke color of the symbol | Color | undefined |
|**strokeDash** | the dashes and gaps for the symbol stroke | String | undefined |
|**strokeWidth** | the stroke width of the symbol in pixels | Number | undefined |
|**type** <img width="70px" src="../../readonly.png"> | the type of the symbol | String | "symbol" |
|**visibility**| whether the symbol is visible ("visible" or "hidden") | String | "visible" |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **resize**(width, height) | change the width and height of the symbol<br>width (Number): width<br>height (Number): height | void |
{.table-striped}

### Data-driven icons

Like Image's `src` channel, a symbol's `path` can be data-encoded so different data values render different icons (e.g. one glyph per category in an icon array):
```js
    msc.encode(star, "path", "group", {mapping: {"A": starPath, "B": circlePath}});
```
