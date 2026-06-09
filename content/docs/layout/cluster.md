---
title: "ClusterLayout"
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

The ClusterLayout class represents a layout that positions objects in a cluster tree. It supports two modes controlled by the **radial** property: in radial mode the tree is arranged around a center point using `angleExtent`, `radius`, `x`, and `y`; in non-radial mode the tree is arranged along an axis using `orientation`, `width`, `height`, `left`, and `top`. To create a ClusterLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/):

    let cl = msc.layout("cluster", {radial: true, radius: 300});
    collection.layout = cl;

### Properties
| property | explanation | type | default value |
| --- | --- | --- | --- |
| **angleExtent** | the angular extent of the radial layout in degrees | Number | 360 |
| **height** | the height of the non-radial layout area | Number | 600 |
| **left** | the x offset of the non-radial layout area | Number | 60 |
| **orientation** | the orientation of the non-radial layout | String | "horizontal" |
| **radius** | the radius of the radial layout | Number | 300 |
| **refElements** <img width="70px" src="../../readonly.png"> | the reference elements used by this layout | Array | [] |
| **top** | the y offset of the non-radial layout area | Number | 100 |
| **type** | the type of the layout | String | "cluster" |
| **width** | the width of the non-radial layout area | Number | 800 |
| **x** | the x coordinate of the radial layout center | Number | 300 |
| **y** | the y coordinate of the radial layout center | Number | 300 |

{.table-striped}

### Methods
| method | explanation | return type |
| --- | --- | --- |
| **clone**() | returns a copy of this layout | ClusterLayout |
| **isRadial**() | returns whether the layout is in radial mode | Boolean |

{.table-striped}

### Methods inherited from Layout
| method | explanation | return type |
| --- | --- | --- |
| **addRefElement**(re) | adds a reference element to this layout | void |
| **clearRefElements**() | removes all reference elements from this layout | void |

{.table-striped}
