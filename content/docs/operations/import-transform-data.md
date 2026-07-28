---
title: "Import and Transform Data"
description: ""
lead: ""
date: 2026-06-06T00:00:00+00:00
lastmod: 2026-06-06T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "operations"
weight: 1
toc: true
---

This page covers operations for importing data, defining transforms, and
deriving new tables in Mascot.

### async msc.csv(url)

Imports a CSV file as a [DataTable](../../data/datatable/).

- `url` (String): path to the file
- Return type: Promise

<hr style="border: 0; border-top: 1px solid #cccccc;">

### async msc.csvFromString(data, name)

Imports CSV text as a [DataTable](../../data/datatable/).

- `data` (String): CSV text
- `name` (String): table name
- Return type: Promise

<hr style="border: 0; border-top: 1px solid #cccccc;">

### async msc.treeJSON(url)

Imports tree data in JSON format as a [Tree](../../data/tree/).

- `url` (String): path to the file
- Return type: Promise

<hr style="border: 0; border-top: 1px solid #cccccc;">

### async msc.graphJSON(url)

Imports graph data in JSON format as a [Network](../../data/network/).

- `url` (String): path to the file
- Return type: Promise

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.transform(type, params)

Defines a predefined transform spec for use with `scene.derive(...)`.

- `type` (String): predefined transform type such as `"bin"`, `"filter"`, or `"kde"`
- `params` (Object): configuration object for the transform type
- Return type: Object

<hr style="border: 0; border-top: 1px solid #cccccc;">

### msc.transform("custom", fn, params)

Defines a custom transform spec for use with `scene.derive(...)`.

- `fn` (Function): `(inTbl, outTbl, spec) => void`
- `params` (Object, optional): initial mutable state for the custom transform
- Return type: Object

<hr style="border: 0; border-top: 1px solid #cccccc;">

### scene.derive(table, transformSpec)

Applies a transform spec to a source [DataTable](../../data/datatable/) and returns a new derived table.

- `table` ([DataTable](../../data/datatable/)): source table
- `transformSpec` (Object): object returned by `msc.transform(...)`
- Return type: [DataTable](../../data/datatable/)

### Example: interval filter

```js
let scene = msc.scene();
let dt = await msc.csv("/datasets/csv/gapminder.csv");
let years = dt.unique("year").sort((a, b) => a - b);
let yearFilter = msc.transform("filter", {
    attribute: "year",
    type: "interval",
    value: [years[0], years[0]]
});
let yearData = scene.derive(dt, yearFilter);
```

### Example: dynamic binning

```js
let scene = msc.scene();
let dt = await msc.csv("/datasets/csv/car-weight.csv");
let binSpec = msc.transform("bin", { attribute: "weight(lbs)", numBins: 8 });
let binned = scene.derive(dt, binSpec);
```

For transform types and options, see
[Transformations](../../data/datatransform/).
