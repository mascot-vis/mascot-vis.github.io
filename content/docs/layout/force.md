---
title: "ForceLayout"
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

The ForceLayout class represents a layout that positions objects using a force-directed algorithm. The simulation is centered at `(x, y)` and advanced a fixed number of `iterations` ticks. To create a ForceLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/):

    let fl = msc.layout("force", {repulsion: 50, linkDistance: 40});
    collection.layout = fl;

### Properties
| property | explanation | type | default value |
| --- | --- | --- | --- |
| **refElements** <img width="70px" src="../../readonly.png"> | the reference elements used by this layout | Array | [] |
| **type** | the type of the layout | String | "force" |

{.table-striped}

### Methods
| method | explanation | return type |
| --- | --- | --- |
| **clone**() | returns a copy of this layout | ForceLayout |

{.table-striped}

### Methods inherited from Layout
| method | explanation | return type |
| --- | --- | --- |
| **addRefElement**(re) | adds a reference element to this layout | void |
| **clearRefElements**() | removes all reference elements from this layout | void |

{.table-striped}
