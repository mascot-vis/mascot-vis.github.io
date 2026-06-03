---
title: "Manage Elements"
description: ""
lead: ""
date: 2026-06-03T00:00:00+00:00
lastmod: 2026-06-03T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "operations"
weight: 4
toc: true
---

These operations traverse scenes and groups to locate related elements.

### msc.findElements(container, objs, includeVerticesSegments)

Finds elements inside a container that match a set of [predicates](../../data/predicate/).

- `container`: [Scene](../../group/scene/) or [Group](../../group/group/)
- `objs` (Array, optional): array of predicate objects
- `includeVerticesSegments` (Boolean, optional): whether vertices and segments should also be searched
- Return type: `Array`

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.getLeafMarks(elem, uniqueClassIDs)

Returns the leaf marks under an element.

- `elem`: [Group](../../group/group/) or [Mark](../../marks/mark/)
- `uniqueClassIDs` (Boolean, optional): whether to return only one mark per class ID
- Return type: Array of [Mark](../../marks/mark/)

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.getPeers(elem, container)

Returns elements that share the same class ID as the given element.

- `elem`: [Mark](../../marks/mark/), [Group](../../group/group/), vertex, or segment
- `container` ([Scene](../../group/scene/) or [Group](../../group/group/), optional): limits the search scope
- Return type: `Array`
