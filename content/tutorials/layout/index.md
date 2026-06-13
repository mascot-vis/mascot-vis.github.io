---
title: "5. Lay out Objects"
description: ""
lead: ""
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  tutorials:
    parent: "tutorials"
weight: 40
---

We often get a collection of graphical objects after applying repeat or divide operations. These collections can be positioned using [layouts](../../docs/layout/layout/). Mascot currently provides the following types of layout: [grid](../../docs/layout/grid/), [stack](../../docs/layout/stack/), [packing](../../docs/layout/packing/), and [treemap](../../docs/layout/treemap/).

To create a layout, use the _layout_ function, for example,

```js
let tl = msc.layout("treemap", {width: 800, height: 500});
```

A layout can only be applied to a collection:

    collection.layout = tl;

You can also pass a layout as an argument when performing the [repeat](../../docs/operations/generative/#mscrepeatelem-data-params) operation:

```js
let collection = msc.repeat(rect, table, {attribute: "col", layout: tl});
```
