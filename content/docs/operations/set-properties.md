---
title: "Update Properties"
description: ""
lead: ""
date: 2026-06-01T00:00:00+00:00
lastmod: 2026-06-01T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "operations"
weight: 3
toc: true
---

Set properties to define the appearance and behavior of visual objects.

### msc.sortChildren(elem, property, descending, orderedVals)

Sorts the children of a group or the vertices of a path by a data attribute or a channel.

- `elem`: [Group](../../group/group/) or [Path](../../marks/path/)
- `property`: a data attribute name or a channel (e.g., `"x"`, `"y"`, `"width"`, `"height"`)
- `descending` (Boolean, optional): whether to sort in descending order
- `orderedVals` (Array, optional): explicit ranking of string attribute values to sort by
- Return type: `void`

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.translate(elem, dx, dy)

Moves an element by the given offsets along the x and y axes.

- `elem`: [Mark](../../marks/mark/), [Group](../../group/group/), vertex, or segment
- `dx` (Number): offset along the x axis
- `dy` (Number): offset along the y axis
- Return type: `void`

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.update(target, patch)

Updates the properties of an element or a layout. Peer elements sharing the same class ID are updated together.

- `target`: [Mark](../../marks/mark/), [Group](../../group/group/), vertex, segment, or [layout](../../layout/layout/)
- `patch` (Object): properties to update, where each key is a channel (e.g., `"x"`, `"y"`, `"width"`, `"height"`, `"radius"`), a style (e.g., `"fillColor"`, `"opacity"`), or `"layout"`
- Return type: `void`
