# Mascot.js Code Patterns

Use these idioms when generating Mascot.js code. They capture the order and style used by current Mascot examples.

## General Static Chart Recipe

1. Create a scene with `msc.scene()`.
2. Load data with `await msc.csv(...)`, `await msc.treeJSON(...)`, or `await msc.graphJSON(...)`.
3. Create one or more prototype marks with `scn.mark(...)`.
4. Use `msc.repeat`, `msc.divide`, or `msc.densify` to generate the chart structure.
5. Apply layout to generated collections.
6. Apply encodings with `msc.encode(...)`.
7. Apply constraints such as `msc.affix` or `msc.align` if labels or marks need relative positioning.
8. Add axes, gridlines, and legends from the scene.
9. Render with `msc.renderer("svg", "svgElement").render(scn)`.

## Inspect Tables Before Choosing Fields

When the natural-language request is underspecified, inspect the DataTable
instead of guessing attribute names or types.

```js
let table = await msc.csv("/datasets/csv/sales.csv");

let attrs = table.attrs();
let measures = table.measures;
let dimensions = table.dimensions;

if (table.has("Date") && table.type("Date") === "string") {
  table.parseDate("Date", "%Y-%m-%d");
}

let salesSummary = table.summary("Sales");
let regions = table.unique("Region");
```

Use `table.rows(...)` for lightweight filtering or validation before building the chart:

```js
let westRows = table.rows({Region: "West"});
let recentRows = table.rows({Year: {min: 2020}});
let selectedRows = table.rows({Region: ["East", "West"]});
```

Use `table.summary(attr)` for min, max, extent, mean, and median. Use
`table.unique(attr)` for distinct values. Do not use `d3.csv`, `d3.csvParse`,
`d3.group`, `d3.rollup`, `d3.sum`, `d3.mean`, or `d3.extent` in generated code.

Do not use removed helper names such as `getRowCount`, `getAttributeSummary`,
`numericAttributes`, `categoricalAttributes`, or `parseAttributeAsDate`.

## Repeat First, Then Layout

Use `msc.repeat` when each group or row should get a copy of a mark, glyph, or collection.

```js
let rect = scn.mark("rect", {
  left: 100,
  top: 80,
  width: 120,
  height: 20
});

let rows = msc.repeat(rect, table, {attribute: "Category"});
rows.layout = msc.layout("grid", {numCols: 1, rowGap: 6});
```

This creates one peer per category, then arranges the peers in a vertical grid.

## Repeat, Then Divide

Use `msc.divide` after `msc.repeat` when each repeated item should be subdivided, such as a stacked bar or grouped bar chart.

```js
let rowCollection = msc.repeat(rect, table, {attribute: "Group"});
rowCollection.layout = msc.layout("grid", {numCols: 1, rowGap: 5});

let {newMark, collection} = msc.divide(rect, table, {
  attribute: "Segment",
  orientation: "horizontal"
});
```

Encode the returned `newMark` to control every generated segment of that mark class.

```js
msc.encode(newMark, {attribute: "Value", channel: "width"});
msc.encode(newMark, {attribute: "Segment", channel: "fillColor"});
```

## Densify for Lines, Areas, and Polygons

Use `msc.densify` when a simple mark should become a data-driven shape with many vertices.

```js
let line = scn.mark("line", {
  x1: 100,
  y1: 200,
  x2: 700,
  y2: 200,
  strokeColor: "#d62728"
});

let path = msc.densify(line, table);
msc.encode(path.firstVertex, {attribute: "date", channel: "x"});
msc.encode(path.firstVertex, {attribute: "value", channel: "y"});
```

After densifying a line, encode the generated vertices, not the original line endpoints.

## Encode Representative Elements

Many operations return a representative generated element. Encoding that representative usually applies the same mapping to its peers.

```js
let {newMark} = msc.divide(rect, table, {
  attribute: "Response",
  orientation: "horizontal"
});

let widthEncoding = msc.encode(newMark, {
  attribute: "Percentage",
  channel: "width"
});

widthEncoding.rangeExtent = 150;
```

## Use Scale Sharing for Related Measures

When two encodings should use the same scale, store the first encoding and pass it as `shareScale` in the second.

```js
let xEncoding = msc.encode(circle, {
  attribute: "valueA",
  channel: "x"
});

msc.encode(label, {
  attribute: "valueA",
  channel: "x",
  shareScale: xEncoding
});
```

## Label with Repeat and Affix

Create text labels as marks, bind their text with `msc.encode`, and attach them to the marks they annotate.

```js
let label = scn.mark("text", {
  fillColor: "#333",
  fontSize: "12px"
});

msc.repeat(label, table);
msc.encode(label, {attribute: "Name", channel: "text"});
msc.affix(label, rect, "x", {offset: 4});
msc.affix(label, rect, "y");
```

This keeps labels tied to the marks they describe, which is safer than manually calculating label coordinates.

## Find Elements Before Special Alignment

Use `msc.findElements` when only a subset of generated elements should be changed.

```js
let agreeBars = msc.findElements(scn, [
  {attribute: "Response", value: "Agree"}
]);

msc.align(agreeBars, "x", "right");
```

This pattern is common in diverging or mirrored charts.

## Add Guides After Encodings

Axes, gridlines, and legends rely on encodings. Add them after `msc.encode` calls.

```js
scn.axis("x", "Percentage", {orientation: "bottom"});
scn.axis("y", "Age Group", {orientation: "left"});
scn.legend("fillColor", "Response", {x: 700, y: 100});
```

## Use Current Operation Style

Older examples may call data operations as scene methods. Current code should use the top-level Mascot functions instead.

Use:

```js
msc.repeat(rect, table);
msc.divide(rect, table, {attribute: "Category"});
msc.densify(line, table);
msc.encode(rect, {attribute: "Value", channel: "height"});
```
