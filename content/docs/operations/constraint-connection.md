---
title: "Create Constraint and Connection"
description: ""
lead: ""
date: 2026-06-08T00:00:00+00:00
lastmod: 2026-10-27T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "operations"
weight: 2
toc: true
---

These operations specify spatial constraints between elements or connect related marks.

### msc.affix(elem, base, channel, params)

Affixes an element to a base element along a channel.

If both `elem` and `base` have been [joined with data](../generative/) (i.e., each has multiple peers), they must have the same number of peers so that each `elem` peer can be affixed to a corresponding `base` peer. 

- `elem`: [Mark](../../marks/mark/)
- `base`: [Mark](../../marks/mark/) or [Collection](../../group/collection/)
- `channel`: `"x"`, `"y"`, `"angle"`, `"radialDistance"`, `"along"`, or a line endpoint: `"x1"`, `"y1"`, `"x2"`, `"y2"`
- `params` (Object, optional):
  - `attribute`: data attribute used to match peers when needed
  - `baseAnchor`: where on the base element: an [anchor](../../global/constants/#anchor), or for `"x"`, `"y"` and the line endpoints, a position by data value (see below)
  - `elementAnchor`: [anchor](../../global/constants/#anchor) on the affixed element
  - `offset`: distance between the two anchors
  - `position`, `rotate`: options of the `"along"` channel (see below)
- Return type: `void`

An error is thrown if `elem` and `base` have different numbers of peers, e.g. when the base is the outer collection of a nested repeat rather than the collection that repeats once per affixed element.

**Along a path.** The `"along"` channel places an element at a point along a [path](../../marks/path/), or along a collection of paths laid along a guide path (a [divided](../generative/#mscdivideelem-data-params) path, or a [stack layout along a path](../../layout/stack/#stacking-along-a-path)), measured on the whole guide:

- `position`: `"start"`, `"center"` (default), `"end"`, or a fraction of the length from 0 to 1
- `rotate`: `"tangent"` (default) turns the element along the path, `"normal"` turns it across the path, `"none"` leaves it as it is. Text is kept upright, and vertical text reads from bottom to top.
- `offset`: moves the element across the path; positive values move it to the right of the direction of travel (as seen on screen)

```js
    msc.affix(label, piece, "along", {rotate: "tangent"});      // a label centered on each piece
```

**Positions by data value.** For `"x"`, `"y"` and the line endpoints, `baseAnchor` can be a data value, `{value, encoding}`: the point where the running total of the values the encoding maps to the base's children reaches `value`. The position follows the base when its scale, gap, order or position changes. The base can be:

- a collection of paths laid along a guide path, whose lengths are [encoded](../manage-encodings/#the-length-channel) (`encoding` is the `"length"` encoding): the point along the guide, counted from the first path
- a collection with a vertical or horizontal [stack layout](../../layout/stack/) whose children's sizes are encoded (e.g. `"height"`): read like a value axis, counted up from the bottom of a vertical stack or from the left of a horizontal one

A value exactly between two children lands in the middle of the gap between them. For a path, `baseAnchor` can also be `{position}`, a position along it as for the `"along"` channel.

```js
    let lenEnc = msc.encode(piece, "length", "EV");
    msc.affix(midline, states, "x", {baseAnchor: {value: 270, encoding: lenEnc}});
```

**Line endpoints.** The `"x1"`, `"y1"`, `"x2"` and `"y2"` channels set one end of a [line](../../marks/path/) from the base and leave the other end where it is, so two endpoint affixes can stretch a line across the base. They apply to lines only.

```js
    let line = scene.mark("line", {strokeColor: "orange"});
    msc.affix(line, bars, "y1", {baseAnchor: {value: 270, encoding: htEnc}});
    msc.affix(line, bars, "y2", {baseAnchor: {value: 270, encoding: htEnc}});
    msc.affix(line, bars, "x1", {baseAnchor: "left", offset: -20});
    msc.affix(line, bars, "x2", {baseAnchor: "right", offset: 20});
```

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.align(elems, channel, anchor)

Aligns multiple elements so they share the same position for a channel and anchor.

- `elems` (Array): elements to align
- `channel`: usually `"x"` or `"y"`
- `anchor`: [anchor](../../global/constants/#anchor) used for alignment
- Return type: `void`

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.connect(nodeMarks, linkMarks)

Connects node marks and link marks so each link mark references its source and target node marks.

- `nodeMarks` (Array): node [marks](../../marks/mark/) created from network or tree node data
- `linkMarks` (Array): link [marks](../../marks/linkPath/) created from network or tree edge data
- Return type: `void`
