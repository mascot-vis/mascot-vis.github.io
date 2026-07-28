---
title: "Transformations"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "data"
weight: 80
toc: true
---

Data transforms are defined with `msc.transform(...)` and applied with
`scene.derive(...)`:

```js
let scene = msc.scene();
let table = await msc.csv("data.csv");
let spec = msc.transform("filter", { attribute: "year", type: "interval", value: [1955, 1955] });
let filtered = scene.derive(table, spec);
```

`scene.derive(...)` always returns a new [DataTable](../../data/datatable/).

### Binning

The binning transformation assigns each input row to a numeric interval. This is used in visualizations such as histograms (example demos: [histogram](../../../gallery/#Histogram), [dynamic binning](../../../gallery/?category=interactive#dynamic_binning)).

```js
let binSpec = msc.transform("bin", { attribute: "weight(lbs)", numBins: 8 });
let binned = scene.derive(table, binSpec);
```

The binning transformation exposes generated attribute names you can use in encodings:

- `binSpec.binIdAttr`: bin id attribute (for grouping/repeat)
- `binSpec.startAttr`: bin start value
- `binSpec.endAttr`: bin end value
- `binSpec.actualNumBins`: final number of bins after boundary adjustment

| property | required? | explanation |
| --- | --- | --- |
| `attribute` | required | numeric attribute to bin |
| `numBins` | optional | target number of bins |
| `min` | optional | lower bound override |
| `max` | optional | upper bound override |
{.table-striped}

### Filtering

The filtering transformation keeps only rows that satisfy a predicate spec. Example demos: [tower chart](../../../gallery/#TowerChart) and [DimpVis](../../../gallery/?category=interactive#dimpVis)

```js
let yearFilter = msc.transform("filter", {
    attribute: "year",
    type: "interval",
    value: [1955, 1955]
});
let yearData = scene.derive(table, yearFilter);
```

| property | required? | explanation |
| --- | --- | --- |
| `attribute` | required | attribute to filter |
| `type` | optional | filter mode (for example `"interval"`) |
| `value` | optional | filter value (for interval: `[min, max]`) |
{.table-striped}

### Kernel Density Estimation

The KDE transformation estimates a density curve for a numeric attribute. Example demos: [density plot](../../../gallery/#DensityPlot) and [ridgeline plot](../../../gallery/#ridgelinePlot).

```js
let density = scene.derive(table, msc.transform("kde", {
    attribute: "weight(lbs)",
    newAttribute: "weight_density",
    min: 1500,
    max: 5000,
    interval: 100,
    bandwidth: 10
}));
```

| property | required? | explanation |
| --- | --- | --- |
| `attribute` | required | numeric attribute to estimate density for |
| `newAttribute` | required | output density attribute name |
| `bandwidth` | required | smoothing bandwidth |
| `interval` | required | sampling step |
| `min` | optional | lower sampling bound |
| `max` | optional | upper sampling bound |
| `groupBy` | optional | compute separate densities per group |
{.table-striped}

### Custom transform

The custom transformation lets you define transform logic directly. Example demos: [histograms cross filtering](../../../gallery/?category=interactive#crossfilter_histograms) and [index chart](../../../gallery/?category=interactive#derive_indexChart). The callback receives the
input table, output table, and mutable spec object:

```js
let tableSpec = msc.transform("custom", (inTbl, outTbl, spec) => {
    let rows = spec.selectedRows ? spec.selectedRows.slice(0, 25) : inTbl.rows().slice(0, 25);
    outTbl.load(rows);
}, { selectedRows: null });

let derived = scene.derive(table, tableSpec);
```