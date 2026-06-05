---
title: "TidyTreeLayout"
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

The TidyTreeLayout class represents a layout that positions objects using the tidy tree algorithm within a bounding box of `width` × `height`, offset by `left` and `top`. To create a TidyTreeLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/):

    let tl = msc.layout("tidytree", {orientation: "vertical"});
    collection.layout = tl;

### Properties
| property | explanation | type | default value |
| --- | --- | --- | --- |
| **height** | the height of the layout area | Number | 500 |
| **left** | the x offset of the layout area | Number | 100 |
| **orientation** | the orientation of the tree | String | "horizontal" |
| **refElements** <img width="70px" src="../../readonly.png"> | the reference elements used by this layout | Array | [] |
| **top** | the y offset of the layout area | Number | 100 |
| **type** | the type of the layout | String | "tidytree" |
| **width** | the width of the layout area | Number | 500 |

{.table-striped}

### Methods
| method | explanation | return type |
| --- | --- | --- |
| **clone**() | returns a copy of this layout | TidyTreeLayout |

{.table-striped}

### Methods inherited from Layout
| method | explanation | return type |
| --- | --- | --- |
| **addRefElement**(re) | adds a reference element to this layout | void |
| **clearRefElements**() | removes all reference elements from this layout | void |

{.table-striped}
