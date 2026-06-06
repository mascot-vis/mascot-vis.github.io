---
title: "Layout"
description: ""
lead: ""
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "layout"
weight: 600
toc: true
---
<span style="font-size:1.2em">Subclasses: [CircularLayout](../circular/), [ClusterLayout](../cluster/), [DirectedGraphLayout](../graph/), [ForceLayout](../force/), [GridLayout](../grid/), [PackingLayout](../packing/), [StackLayout](../stack/), [StrataLayout](../strata/), [TidyTreeLayout](../tidytree/), [TreemapLayout](../treemap/)</span>

The Layout class is an abstract class representing layout algorithms used to position children in a [group](../../group/group/). You cannot create a layout object, you can only create instances of its subclasses. 

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **clone**() | returns a copy of this layout | void |
| **run**() | apply this layout | void |
