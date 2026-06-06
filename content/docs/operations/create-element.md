---
title: "Create Components"
description: ""
lead: ""
date: 2026-06-01T00:00:00+00:00
lastmod: 2026-06-01T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "operations"
weight: 1
toc: true
---

These operations instantiate new visual elements or apply lightweight composition constraints.

### msc.affix(elem, base, channel, params)

Affixes an element to a base element along a channel.

- `elem`: [Mark](../../marks/mark/)
- `base`: [Mark](../../marks/mark/)
- `channel`: `"x"`, `"y"`, `"angle"`, or `"radialDistance"`
- `params` (Object, optional):
  - `attribute`: data attribute used to match peers when needed
  - `baseAnchor`: [anchor](../../global/constants/#anchor) on the base element
  - `elementAnchor`: [anchor](../../global/constants/#anchor) on the affixed element
  - `offset`: distance between the two anchors
- Return type: `void`

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.align(elems, channel, anchor)

Aligns multiple elements so they share the same position for a channel and anchor.

- `elems` (Array): elements to align
- `channel`: usually `"x"` or `"y"`
- `anchor`: [anchor](../../global/constants/#anchor) used for alignment
- Return type: `void`

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.layout(type, params)

Creates a [layout](../../layout/layout/).

- `type`: [layout type](../../global/constants/#layout-type)
- `params` (Object): contains layout properties
- Return type: [Layout](../../layout/layout/)

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.linearGradient(params)

Creates a [linear gradient](../../basic/lineargradient/).

- `params` (Object): contains `x1`, `y1`, `x2`, and `y2` properties
- Return type: [LinearGradient](../../basic/lineargradient/)

<hr style="border: 0; border-top: 1px solid #cccccc;">

### scene.mark(type, params)

Creates a [mark](../../marks/mark/).

- `type`: [mark type](../../global/constants/#mark-type)
- `params` (Object): contains mark properties
- Return type: [Mark](../../marks/mark/)

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.scene(params)

Creates a [scene](../../group/scene/).

- `params` (Object, optional):
  - `fillColor`: background color of the scene
- Return type: [Scene](../../group/scene/)
