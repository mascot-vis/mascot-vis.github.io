---
title: "Specify Constraints and Connections"
description: ""
lead: ""
date: 2026-06-08T00:00:00+00:00
lastmod: 2026-06-08T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "operations"
weight: 2
toc: true
---

These operations specify spatial constraints between elements or connect related marks.

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

### msc.connect(nodeMarks, linkMarks)

Connects node marks and link marks so each link mark references its source and target node marks.

- `nodeMarks` (Array): node [marks](../../marks/mark/) created from network or tree node data
- `linkMarks` (Array): link [marks](../../marks/linkPath/) created from network or tree edge data
- Return type: `void`
