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

<!-- Each child is translated directly to its exact point on the circle, so a child's position/bounds are always accurate; `markRotation` only ever controls its own visual orientation, never where it actually sits. `markRotation` can be `"outward"` (faces away from the center), `"inward"` (faces toward the center), `"tangentialClockwise"` / `"tangentialCounterClockwise"` (faces along the tangent, in the given direction of travel around the circle), or `"upright"` (orientation is left exactly as authored, regardless of position). `markRotation` assumes a child's own unrotated "forward"/tip points straight down (+y) -- the common authoring convention for icons like a heart, pin, or teardrop. Icons authored a different way (e.g. an arrow pointing right) will need their own artwork adjusted to match, since [Symbol](../../marks/symbol/) currently has no pre-rotation property to compensate for this. Note `markRotation` currently only has a visible effect on Symbol marks, since they're the only mark type with a local-rotation channel to apply it through -- for other mark types, all `markRotation` values behave the same as `"upright"`.  -->

    let cl = msc.layout("circular", {x: 200, y: 200, radius: 150});
    collection.layout = cl;

### Properties
| property | explanation | type | default value |
| --- | --- | --- | --- |
| **markRotation** | how each child is oriented as it's placed around the circle: `"outward"` (faces away from center), `"inward"` (faces toward center), `"tangentialClockwise"` / `"tangentialCounterClockwise"` (faces along the tangent, in that direction of travel), or `"upright"` (orientation never changes, regardless of position) | String | "inward" |
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
