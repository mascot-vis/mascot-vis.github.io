---
title: "DirectedGraphLayout"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "layout"
weight: 610
toc: true
---
<span style="font-size:1.2em">extends [Layout](../layout/)</span><br>

The DirectedGraphLayout class represents a layout that positions objects using a directed graph algorithm. The `direction` property controls the rank direction of the graph. To create a DirectedGraphLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/):

    let gl = msc.layout("directedgraph", {direction: "l2r"});
    collection.layout = gl;

This layout is implemented using the [dagre](https://github.com/dagrejs/dagre/wiki) library. 

### Properties
| property | explanation | type | default value |
| --- | --- | --- | --- |
| **direction** | the direction in which ranks are laid out | String | "t2b" |
| **edgeSep** | the separation between edges in the graph | Number | 50 |
| **left** | the x offset of the layout area | Number | 0 |
| **nodeSep** | the separation between nodes in the graph | Number | 100 |
| **rankSep** | Number of pixels between each rank in the layout | Number | 50 |
| **refElements** <img width="70px" src="../../readonly.png"> | the reference elements used by this layout | Array | [] |
| **spreadLinks** | whether to spread links across the available width | Boolean | true |
| **top** | the y offset of the layout area | Number | 0 |
| **type** | the type of the layout | String | "directedgraph" |

{.table-striped}

### Methods
| method | explanation | return type |
| --- | --- | --- |
| **clone**() | returns a copy of this layout | DirectedGraphLayout |

{.table-striped}

### Methods inherited from Layout
| method | explanation | return type |
| --- | --- | --- |
| **addRefElement**(re) | adds a reference element to this layout | void |
| **clearRefElements**() | removes all reference elements from this layout | void |

{.table-striped}
