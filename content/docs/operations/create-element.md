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

These operations instantiate new visual elements for composition and interaction.

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

### msc.mark(type, params)

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