# Mascot.js Allowed API Reference

Only use APIs listed in this file when generating Mascot.js code. Do not invent methods, classes, properties, or signatures. Prefer the current top-level function style, for example `msc.encode(...)`, `msc.repeat(...)`, and `msc.affix(...)`.

## Module-Level Constructors, Data Import, and Data Transforms

```js
let scn = msc.scene(params);
let layout = msc.layout(type, params);
let table = msc.table(args);

let csvTable = await msc.csv(url);
let tableFromString = msc.csvString(csvText);
let graph = await msc.graphJSON(url);
let tree = await msc.treeJSON(url);

let transformSpec = msc.transform(type, args, params);
```

`msc.csv(...)`, `msc.csvString(...)`, and `msc.table(...)` return a DataTable.
`msc.ROW_ID` is the internal row-id attribute name (`"mascot_rowId"`).

Hard rule for generated code: use Mascot's data import and DataTable APIs only.
Do not import or call d3, lodash, Arquero, Vega, Observable helpers, `fetch`, or
manual CSV parsers. Mascot uses d3 internally, but d3 is not part of the allowed
generated-code API.

Use these replacements instead of common d3 patterns:

```js
// CSV file
let table = await msc.csv("/datasets/csv/sales.csv");

// CSV text that is already available in memory
let tableFromText = msc.csvString(csvText);

// Rows that are already available as an array of objects
let tableFromRows = msc.table(rows);

// Filtered table for downstream Mascot operations
let westRows = table.rows({Region: "West"});
let westTable = msc.table(westRows);
```

Do not use these in generated code:

```js
d3.csv(...);
d3.csvParse(...);
d3.group(...);
d3.rollup(...);
d3.sum(...);
d3.mean(...);
d3.extent(...);
d3.timeParse(...);
fetch(...);
```

Supported transform type strings are:

`bin`, `kde`, `filter`, and `custom`.

Common transform specifications:

```js
let binSpec = msc.transform("bin", {
  attribute: "weight(lbs)",
  numBins: 8
});

let kdeSpec = msc.transform("kde", {
  attribute: "weight(lbs)",
  newAttribute: "weight_density",
  groupBy: ["species"],
  min: 1500,
  max: 6000,
  interval: 100,
  bandwidth: 10
});

let filterSpec = msc.transform("filter", {
  attribute: "date",
  type: "interval",
  value: [startDate, endDate]
});

let derivedTable = scn.derive(table, binSpec);
```

Filter transform `type` values are `point`, `list`, and `interval`. For filter
transforms, point values are a single value, list values are arrays, and interval
values are `[min, max]` arrays.

Supported layout type strings include:

`grid`, `stack`, `packing`, `force`, `directedgraph`, `tidytree`, `treemap`, `strata`, `circular`, and `cluster`.

Common layout direction and orientation strings include:

`horizontal`, `vertical`, `angular`, `radial`, `l2r`, `r2l`, `t2b`, `b2t`, `clockwise`, `anti-clockwise`, `inward`, and `outward`.

## DataTable

Use DataTable methods to inspect attributes, check data types, parse dates,
retrieve filtered rows, and get basic summaries before choosing encodings or
data-driven operations.

```js
let tableId = table.id;
let tableName = table.name;
let sourceUrl = table.url;
let dataRows = table.data;

let attrs = table.attrs();
let numericAttrs = table.attrs("number").concat(table.attrs("integer"));
let dimensions = table.dimensions;
let measures = table.measures;

let rowCount = table.count();
let hasSales = table.has("Sales");
let salesType = table.type("Sales");
let salesSummary = table.summary("Sales");
let salesValues = table.values("Sales");
let categories = table.unique("Category");
```

Supported data type strings are:

`boolean`, `integer`, `number`, `date`, and `string`.

Additional table methods:

```js
let copy = table.clone();
let encodableAttrs = table.encodable("x");
table.addAttr("Profit Ratio", "number", values);
table.load(rows);
table.order("Category", ["A", "B", "C"]);
table.parseDate("Date", "%Y-%m-%d");
let originalDate = table.raw("Date", parsedDateValue);
table.summarize();
```

`table.rows(filters)` supports exact-match filters, set filters, and interval filters:

```js
let westRows = table.rows({Region: "West"});
let selectedRows = table.rows({Region: ["East", "West"]});
let recentRows = table.rows({Year: {min: 2020}});
let midRangeRows = table.rows({Sales: {min: 100, max: 500}});
```

For `table.rows(...)`, exact-match filters use a single primitive value, set
filters use an array of accepted values, and interval filters use an object with
`min` and/or `max`.

Use `table.summary(attr)` instead of d3 summary helpers:

```js
let summary = table.summary("Sales");
let minSales = summary.min;
let maxSales = summary.max;
let averageSales = summary.mean;
let medianSales = summary.median;
```

Use `table.unique(attr)` instead of `d3.group(...)` when the code only needs the
distinct values for an attribute. Use encoding aggregators such as
`aggregator: "sum"` when the visualization should aggregate values through a
visual channel.

For grouping and aggregation, prefer Mascot's data-driven operations and
encoding aggregators instead of manually computing grouped arrays. For example,
repeat by the grouping attribute, then encode the quantitative attribute with an
aggregator:

```js
let bars = msc.repeat(rect, table, {attribute: "Category"});
bars.layout = msc.layout("grid", {numCols: 1, rowGap: 8});

msc.encode(rect, {
  attribute: "Sales",
  channel: "width",
  aggregator: "sum"
});
```

Use `table.parseDate(attr, format)` when a date column needs a specific time
format string such as `"%Y-%m-%d"`. Date values are stored internally as
millisecond timestamps; use `table.raw(attr, value)` when the original date label
is needed.

Do not use old table helper names such as `getAttributeSummary`, `getRowCount`,
`parseAttributeAsDate`, `numericAttributes`, or `categoricalAttributes`.

## Network and Tree Data

`msc.graphJSON(url)` returns a Network. Use the Network API to inspect graph data:

```js
let graph = await msc.graphJSON("/datasets/json/network.json");
let nodeTable = graph.nodeTable;
let linkTable = graph.linkTable;
let nodes = graph.nodeList;
let links = graph.linkList;
let node = graph.getNode("node-id");
let adjacentLinks = graph.getLinks(node);
let hierarchy = graph.buildNodeHierarchy(["group", "subgroup"]);
```

`msc.treeJSON(url)` returns a Tree. Use the Tree API to inspect hierarchical data:

```js
let tree = await msc.treeJSON("/datasets/json/tree.json");
let nodeTable = tree.nodeTable;
let linkTable = tree.linkTable;
let root = tree.getRoot();
let node = tree.getNode("node-id");
let children = tree.getChildren(node);
let parent = tree.getParent(node);
```

`nodeTable` and `linkTable` are DataTable objects, so use the DataTable methods
above to inspect attributes, summaries, and rows.

## Scene Methods

```js
let mark = scn.mark(type, params);
let glyph = scn.glyph(...marks);
let composite = scn.composite();

let tables = scn.tables;

let axis = scn.axis(channel, attribute, params);
let gridlines = scn.gridlines(channel, attribute, params);
let legend = scn.legend(channel, attribute, params);

scn.mask(element);
scn.setLayout(group, layout);
let derivedTable = scn.derive(table, transformSpec);

let element = scn.getElement(id);
let axis = scn.getAxis(attribute, channel);
```

Direct mark type strings:

`rect`, `circle`, `line`, `ring`, `path`, `image`, `text`, `richText`, `arc`, `bezierCurve`, `bundledPath`, and `chord`.

Do not create marks from the top-level Mascot module. Marks are created from a scene with `scn.mark(...)`.

### `polarRadius` / `polarAngle` axis and gridlines (radar-chart style)

Both channels work with `scn.axis()`/`scn.gridlines()`, the same way `radialDistance` already did for radar charts, as long as a matching `msc.encode(..., "polarRadius"/"polarAngle", attribute, ...)` already exists on the target.

```js
// polarRadius: one radial spoke per axis() call, at a fixed angle
scn.axis("polarRadius", "ppm", {rotation: 0, tickValues: [380, 390, 400], labelFormat: "d"});
// concentric rings, one gridlines() call for all of them
scn.gridlines("polarRadius", "ppm", {values: [380, 390, 400]});

// polarAngle: one circular axis for all ticks at once, at a fixed radius
scn.axis("polarAngle", "month", {
  radius: 260,                              // fixed radius the circular baseline/ticks sit at
  tickValues: [1, 2, 3, /* ... */ 12],       // numeric -- must be on the same scale as the data encoding
  labelValues: ["Jan", "Feb", "Mar" /* ... */], // optional, independent of tickValues -- lets tick position
                                                 // (numeric) and displayed text (e.g. names) differ
  pathVisible: false, tickVisible: false     // hide the circular baseline/tick marks, show labels only
});
// one spoke (radial line) per value, out to a fixed radius
scn.gridlines("polarAngle", "month", {values: [1, 2, 3, /* ... */ 12], radius: 268});
```

`polarAngle`'s `radius` option (both on `axis()` and `gridlines()`) has no auto-computed default the way `polarRadius`'s ring/spoke extent does -- pass it explicitly.

## Data Join and Generative Operations

```js
let collection = msc.repeat(element, data, params);

let result = msc.divide(element, data, params);
let newMark = result.newMark;
let collection = result.collection;

let generatedMark = msc.densify(element, data, params);

msc.attach(element, table);
let classified = msc.classify(collection, params);
let stratified = msc.stratify(element, tree, params);
msc.repopulate(collection, table, mapping);
```

Common operation parameters:

```js
{attribute: "Category"}
{attribute: "Category", orientation: "horizontal"}
{attribute: "Category", layout: msc.layout("grid", {numCols: 1})}
```

Use `msc.repeat`, `msc.divide`, and `msc.densify` before applying most layouts and encodings. These are top-level Mascot functions, not scene methods.

## Encoding

```js
let encoding = msc.encode(element, {
  attribute: "value",
  channel: "height"
});
```

Common encoding parameters:

```js
{
  attribute: "value",
  channel: "height",
  aggregator: "sum",
  mapping: {"A": "#1f77b4", "B": "#ff7f0e"},
  range: [0, 200],
  rangeExtent: 150,
  scaleType: "linear",
  scheme: "interpolateViridis",
  shareScale: anotherEncoding,
  flipScale: false,
  origin: [cx, cy]
}
```

Common channels used in current examples:

`x`, `y`, `width`, `height`, `area`, `radius`, `polarRadius`, `polarAngle`, `angle`, `text`, `fillColor`, `strokeColor`, `strokeWidth`, `fillGradient`, and `src`.

`polarRadius` and `polarAngle` work on path/polygon vertices *and* on a plain `repeat()` collection of marks. Two things to know: (1) encode `polarAngle` before `polarRadius` -- the radius encoding reads whatever angle is currently stored, so the reverse order silently produces wrong positions; (2) pass an explicit `origin: [cx, cy]` unless the target is a `Polygon` (from `msc.densify()` on a `circle`), which already has its own fixed center to fall back on -- a generic `Path` (from `msc.densify()` on a `line`) or a bare `repeat()` collection has no center of its own.

`radialDistance` is a deprecated alias for `polarRadius` -- still works (normalized automatically, e.g. in `encode()`/`scene.axis()`/`scene.gridlines()`), but logs a console warning and shouldn't be used in new code.

Encoding helper functions are available when needed:

```js
msc.removeEncoding(encoding, scene);
msc.getChannelEncodingByAttribute(attribute, channel, scene);
msc.getChannelEncodingByElement(element, channel);
msc.getEncodingsByElement(element, includeVertexSegment);
msc.getEncodingsByChannel(channel, scene);
msc.isDataBound(element, channel);
msc.isDataBoundHorizontally(element);
msc.isDataBoundVertically(element);
```

## Constraints and Connections

```js
msc.affix(element, baseElement, channel, params);
msc.align(elements, channel, anchor);
msc.connect(nodeMarks, linkMarks);
```

Examples:

```js
msc.affix(label, bar, "x");
msc.affix(label, bar, "y", {offset: 4});
msc.align(bars, "x", "right");
```

Common channels for constraints include `x` and `y`. Common anchors include `left`, `right`, `top`, `bottom`, `center`, and `middle`.

## Finding and Managing Elements

```js
let elements = msc.findElements(container, predicates, includeVerticesSegments);
let peers = msc.getPeers(element, container);
let leafMarks = msc.getLeafMarks(element, uniqueClassIDs);

msc.update(elementOrLayout, patch);
msc.translate(element, dx, dy);
msc.sortChildren(element, property, descending, orderedVals);
```

Predicate examples:

```js
msc.findElements(scn, [{attribute: "Response", value: "Agree"}]);
msc.findElements(scn, [{property: "classId", value: someElement.classId}]);
```

## Rendering

```js
msc.renderer("svg", "svgElement").render(scn);
```

The second argument is the id of the target SVG container.

## Serialization

```js
let json = msc.serialize(sceneOrElement);
let restored = msc.deserialize(json);
let same = msc.isEqual(sceneA, sceneB);
```

## Interaction

```js
msc.activate(trigger, responder, responderEval, responderUpdate, animation);
```

Use `msc.activate` only when the user explicitly asks for interaction. Static chart examples should normally omit it.

## Avoid Stale or Unsupported Forms

Use the current top-level operation names and current data loader casing:

```js
msc.repeat(...);
msc.divide(...);
msc.densify(...);
msc.encode(...);
msc.affix(...);
msc.align(...);
scn.mark(...);
msc.treeJSON(...);
msc.graphJSON(...);
```

Do not convert these into scene methods, and do not lowercase the `JSON` suffix in the tree and graph loaders.
