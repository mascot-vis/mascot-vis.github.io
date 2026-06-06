---
title: "StrataLayout"
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

The StrataLayout class represents a layout that positions a tree's children by stratum. The `direction` property is required. To create a StrataLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/):

    let sl = msc.layout("strata", {direction: "t2b", gap: 5});
    collection.layout = sl;

### Properties
| property | explanation | type | default value |
| --- | --- | --- | --- |
| **refElements** <img width="70px" src="../../readonly.png"> | the reference elements used by this layout | Array | [] |
| **type** | the type of the layout | String | "strata" |

{.table-striped}

### Methods
| method | explanation | return type |
| --- | --- | --- |
| **clone**() | returns a copy of this layout | StrataLayout |

{.table-striped}

### Methods inherited from Layout
| method | explanation | return type |
| --- | --- | --- |
| **addRefElement**(re) | adds a reference element to this layout | void |
| **clearRefElements**() | removes all reference elements from this layout | void |

{.table-striped}
