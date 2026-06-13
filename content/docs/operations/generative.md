---
title: "Join Elements with Data"
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

These operations join elements with data or restructure data-bound collections.

### msc.attach(elem, table)

Attaches an entire [data table](../../data/datatable/) to a single [mark](../../marks/mark/) or [group](../../group/group/).

- `elem`: [Mark](../../marks/mark/) or [Group](../../group/group/)
- `table`: [DataTable](../../data/datatable/)
- Return type: `void`

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.classify(coll, params)

Classifies the children of a [collection](../../group/collection/) into nested collections by a data attribute.

- `coll`: [Collection](../../group/collection/)
- `params` (Object):
  - `attribute`: data attribute used to classify the collection children
  - `layout` ([Layout](../../layout/layout/), optional): layout for the new nested collections
- Return type: [Collection](../../group/collection/)

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.densify(elem, data, params)

Creates a denser mark from an existing element by a data attribute.

- `elem`: [Mark](../../marks/mark/) such as a line, circle, or rect
- `data`: [DataTable](../../data/datatable/)
- `params` (Object, optional):
  - `attribute`: data attribute used to densify the element, defaults to tuple ID
  - `orientation`: orientation for densifying rectangle-based elements
- Return type: [Mark](../../marks/mark/)

{{< figure src="../densify.svg" alt="densify operation" width="700px" caption="The densify operation adds N vertices along a mark's boundary, replacing curves with line segments. Each vertex is a peer bound to a unique attribute value. Area marks receive 2N vertices (N per parallel edge)." class="border-0 mx-auto text-center" >}}

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.divide(elem, data, params)

Divides an element by a data attribute and returns both the new mark and the resulting collection.

- `elem`: [Mark](../../marks/mark/)
- `data`: [DataTable](../../data/datatable/)
- `params` (Object, optional):
  - `attribute`: data attribute used to divide the element, defaults to tuple ID
  - `orientation`: orientation for the divide operation
- Return type: object containing `newMark` ([Mark](../../marks/mark/)) and `collection` ([Collection](../../group/collection/))

{{< figure src="../divide.svg" alt="divide operation" width="700px" caption="The divide operation splits a mark into N peers within the same spatial area. Output structure depends on the mark type and the `orientation` parameter. N is the number of unique values in the specified attribute." class="border-0 mx-auto text-center" >}}

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.repeat(elem, data, params)

Repeats an element across a data table, tree, or network.

- `elem`: [Mark](../../marks/mark/), [Glyph](../../group/glyph/), [Collection](../../group/collection/), or an array containing a node mark and a link mark
- `data`: [DataTable](../../data/datatable/), [Tree](../../data/tree/), or [Network](../../data/network/)
- `params` (Object, optional):
  - `attribute`: data attribute used to repeat the element, defaults to tuple ID
  - `layout` ([Layout](../../layout/layout/), optional): layout for repeated collections
- Return type: [Collection](../../group/collection/) or Array of [Collections](../../group/collection/)

{{< figure src="../repeat.svg" alt="repeat operation" width="700px" caption="The repeat operation produces N peers — one per unique attribute value. Peers share the same initial position and visual properties; they are shown side-by-side here for clarity." class="border-0 mx-auto text-center" >}}

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.repopulate(coll, dt, mapping)

Repopulates a nested [collection](../../group/collection/) using a new data table and attribute mapping.

- `coll`: [Collection](../../group/collection/)
- `dt`: [DataTable](../../data/datatable/)
- `mapping` (Object): maps each collection level to a data attribute
- Return type: `void`

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.stratify(elem, tree, params)

Creates a stratified [collection](../../group/collection/) from a rect, circle, or ring using tree data.

- `elem`: a rect, circle, or ring [Mark](../../marks/mark/)
- `tree`: [Tree](../../data/tree/) or an array of [Tree](../../data/tree/) objects
- `params` (Object, optional):
  - `direction`: direction for the strata layout
  - `startFromLeaf`: whether to build strata from leaves
  - `size`: thickness or size of each stratum
- Return type: [Collection](../../group/collection/)
