---
title: "PathGradient"
description: ""
lead: ""
date: 2026-08-03T00:00:00+00:00
lastmod: 2026-08-03T00:00:00+00:00
draft: false
images: []
menu: 
  docs:
    parent: "basic"
weight: 22
toc: true
---

The PathGradient class represents a sequence of colors, one per vertex of a [Path](../../marks/path/)-like mark (Path, Line, or Polygon), used for the stroke color property. It is rendered as a chain of small linear gradients running along the mark's actual vertices, one per segment, rather than along one fixed straight axis.

This is different from a [LinearGradient](../../basic/lineargradient/), which paints along a single straight vector, so the color at any point on a shape depends on where that point falls spatially (its position within a bounding box or along a fixed line). That works for a straight or roughly-monotonic shape, but breaks down for a curve that loops or spirals, where a point's spatial position has no reliable relationship to its position along the curve. A PathGradient instead assigns a color directly to each vertex, so the color at any point on the curve is always the color of the vertex (or interpolated between the two nearest vertices) closest to it -- correct regardless of the path's shape.

To create a PathGradient object directly, use the [_gradient_ function](../../operations/create-element/#msc-gradienttype-params):

```js
    let pg = msc.gradient("path", ["red", "orange", "yellow"]);
    line.strokeColor = pg;
```

More commonly, a PathGradient is created automatically by encoding the `"strokeGradient"` [channel](../../global/constants/#channel) with [_msc.encode_](../../operations/manage-encodings/#msc-encodeelem-channel-attribute-params), which computes one color per vertex from a data field using the same color-scheme machinery as `fillColor`/`strokeColor`:

```js
    msc.encode(curve, "strokeGradient", "ppm", {domain: [360, 435], scheme: "interpolateYlOrRd"});
```

The element being encoded (`curve` above) must be a mark with vertices -- typically the result of [_msc.densify_](../../operations/manage-elements/) on a Path, Line, or Polygon. A [legend](../../guide/legend/) for a `strokeGradient` encoding can be created the same way as for any other color channel:

```js
    scene.legend("strokeGradient", "ppm", {x: 630, y: 140, orientation: "vertical"});
```

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id**| the unique id of the gradient | String | |
|**colors**| the sequence of colors, one per vertex | Array | [] |
|**type**| the type of the gradient | String | "PathGradient" |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **toJSON**() | returns a JSON representation of the gradient<br><br>`type` (String): the type of the gradient<br>`id` (String): the unique id of the gradient<br>`colors` (Array): the sequence of colors | Object |
{.table-striped}
