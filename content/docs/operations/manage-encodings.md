---
title: "Create and Manage Encodings"
description: ""
lead: ""
date: 2026-06-01T00:00:00+00:00
lastmod: 2026-06-01T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "operations"
weight: 2
toc: true
---

Manage encodings to control how data maps to marks, channels, and layout behavior.

### msc.encode(elem, params)

Encodes a data attribute using a visual channel on an element.

- `elem`: [Mark](../../marks/mark/) or [Group](../../group/group/)
- `params` (Object): has the following [properties](../../encode/encoding/#properties)
  - `channel` (String, required): [visual channel](../../global/constants/#channel)
  - `attribute` (String, required): data attribute
  - `aggregator` (String, optional): [aggregator](../../global/constants/#aggregator), defaults to `"sum"`
  - `scale` ([Scale](../../encode/scale/), optional): the scale to use for the encoding
  - `scaleType` (String, optional): [type of scale](../../encode/scale/#scale-type)
  - `shareScale` ([Encoding](../../encode/encoding/), optional): share the scale of another encoding
  - `flipScale` (Boolean, optional): whether the scale is flipped, defaults to `false`
  - `includeZero` (Boolean, optional): whether the scale domain includes 0, defaults to `false`
  - `rangeExtent` (Number, optional): range extent
  - `mapping` (Object, optional): user-defined mapping between field values and visual properties
  - `scheme` (String, optional): color scheme
  - `startAngle` (Number, optional): start angle in degrees when encoding with the `"angle"` channel, defaults to `90`
  - `angleDirection` (String, optional): direction to encode angles, defaults to `"clockwise"`
- Return type: [Encoding](../../encode/encoding/)

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.getChannelEncodingByAttribute(attribute, channel, scene)

Returns the encoding for given attribute and channel within a scene.

- `attribute` (String): data attribute
- `channel` (String): [visual channel](../../global/constants/#channel)
- `scene` ([Scene](../../group/scene/)): the scene to search
- Return type: [Encoding](../../encode/encoding/) or `null`

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.getChannelEncodingByElement(elem, channel)

Returns the encoding for the given channel on a specific element.

- `elem`: [Mark](../../marks/mark/) or [Group](../../group/group/)
- `channel` (String): [visual channel](../../global/constants/#channel)
- Return type: [Encoding](../../encode/encoding/) or `null`

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.getEncodingsByChannel(channel, scene)

Returns all the encodings in the scene that use the given channel.

- `channel` (String): [visual channel](../../global/constants/#channel)
- `scene` ([Scene](../../group/scene/)): the scene to search
- Return type: Array of [Encodings](../../encode/encoding/)

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.getEncodingsByElement(elem, includeVertexSegment)

Returns all encodings associated with the element.

- `elem`: [Mark](../../marks/mark/) or [Group](../../group/group/)
- `includeVertexSegment` (Boolean, optional): whether to also include encodings on the element's vertices and segments
- Return type: Array of [Encodings](../../encode/encoding/)

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.removeEncoding(enc, scene)

Removes an encoding from the scene.

- `enc` ([Encoding](../../encode/encoding/)): the encoding to remove
- `scene` ([Scene](../../group/scene/), optional): the scene to remove from; defaults to the encoding's own scene
- Return type: `void`
