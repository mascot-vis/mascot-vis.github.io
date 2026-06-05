---
title: "CircularLayout"
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

The CircularLayout class represents a layout that positions objects evenly around a circle. To create a CircularLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/):

    let cl = msc.layout("circular", {x: 200, y: 200, radius: 150});
    collection.layout = cl;

### Properties
| property | explanation | type | default value |
| --- | --- | --- | --- |
| **radius** | the radius of the circle | Number | 100 |
| **refElements** <img width="70px" src="../../readonly.png"> | the reference elements used by this layout | Array | [] |
| **type** | the type of the layout | String | "circular" |
| **x** | the x coordinate of the circle center | Number | 100 |
| **y** | the y coordinate of the circle center | Number | 100 |

{.table-striped}

### Methods
| method | explanation | return type |
| --- | --- | --- |
| **clone**() | returns a copy of this layout | CircularLayout |

{.table-striped}

### Methods inherited from Layout
| method | explanation | return type |
| --- | --- | --- |
| **addRefElement**(re) | adds a reference element to this layout | void |
| **clearRefElements**() | removes all reference elements from this layout | void |

{.table-striped}
