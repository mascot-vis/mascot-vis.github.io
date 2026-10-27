---
title: "StackLayout"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2026-10-27T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "layout"
weight: 610
toc: true
---
<span style="font-size:1.2em">extends [Layout](../layout/)</span><br>

The StackLayout class represents a layout that positions objects by stacking them. To create a StackLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/):

    let sl = msc.layout("stack", {orientation: "vertical"});
    collection.layout = sl;

### Stacking along a path

With the `"path"` orientation, a stack layout lays [paths](../../marks/path/) end to end along a guide path, in the order of the collection's children, with `gap` pixels of empty path between neighbors. The guide is given as SVG path data (`d`, the same format a [path mark](../../marks/path/) accepts) or as points (`path: [[x, y], ...]`). This is the layout of the collection returned by [dividing](../../operations/generative/#mscdivideelem-data-params) a path; it can also be applied to repeated paths:

```js
    let piece = scene.mark("path", {d: "M 100 100 H 150", strokeWidth: 26});
    let states = msc.repeat(piece, table, {attribute: "State", layout: msc.layout("stack", {
        orientation: "path", gap: 1,
        d: "M 108 245 V 336 a 21 21 0 0 0 42 0 V 160 a 21 21 0 0 1 42 0 V 355"
    })});
    msc.encode(piece, "length", "EV");
```

The layout replaces each path's geometry with its stretch of the guide, so the template path's own shape does not matter. Each path takes its [pathLength](../../marks/path/#properties) of the guide: until lengths are set or [encoded](../../operations/manage-encodings/#the-length-channel), the paths share the guide equally; with a `"length"` encoding, the values fill the guide minus the gaps. The layout can be set before or after the encoding. Paths past the end of the guide are clamped to it, and the guide moves with the collection when it is [translated](../../operations/set-properties/#msctranslateelem-dx-dy).

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**baseline**| the baseline of stacking | String |  |
|**d**| for the `"path"` orientation: the guide path as SVG path data (a constructor argument; read the result from **path**) | String |  |
|**gap**| the space in pixels between neighboring children: along the stacking direction, or along the guide path for the `"path"` orientation; set with `msc.update(layout, {gap: 2})` | Number | 0 |
|**group** <img width="70px" src="../../readonly.png">| the group that uses this layout | [Group](../../group/group/) |  |
|**horzCellAlignment**| the horizontal [alignment](../../global/constants/#anchor) of item in each cell | String | "left" |
|**orientation**| the orientation of stacking: `"horizontal"`, `"vertical"`, `"angular"` or `"radial"` (for arcs), or `"path"` (along a guide path) | String | undefined |
|**path**| for the `"path"` orientation: the guide path the children are laid along, as points | Array of [x, y] |  |
|**type** <img width="70px" src="../../readonly.png"> | the type of the layout | String | "stack" | 
|**vertCellAlignment**| the vertical [alignment](../../global/constants/#anchor) of item in each cell | String | "bottom" |
{.table-striped}

### Methods inherited from Layout
| method |  explanation   | return type |
| --- | --- | --- |
| **clone**() <img width="70px" src="../../overrides.png"> | returns a copy of this layout | void |
| **run**() <img width="70px" src="../../overrides.png"> | apply this layout | void |
{.table-striped}