# Mascot.js Annotated Examples

These examples focus on static charts. Each one follows the same basic grammar: create a seed mark, generate structure from data, encode visual channels, add constraints and guides, then render.

## Example 1: Diverging Stacked Bar Chart

Here, a single seed rectangle becomes one row per age group. Each row is then divided into response segments, and selected segments are aligned so the bars diverge from a shared center.

```js
let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/survey_response.csv");

// Seed rectangle. Repeat will create one peer per age group.
let rect = scn.mark("rect", {
  top: 100,
  left: 200,
  width: 700,
  height: 40,
  strokeWidth: 0,
  fillColor: "#ddd"
});

let rows = msc.repeat(rect, dt, {attribute: "Age Group"});
rows.layout = msc.layout("grid", {
  numCols: 1,
  rowGap: 5
});

// Divide each row into response segments.
let {newMark} = msc.divide(rect, dt, {
  attribute: "Response",
  orientation: "horizontal"
});

let widthEncoding = msc.encode(newMark, {
  attribute: "Percentage",
  channel: "width"
});
widthEncoding.rangeExtent = 150;

msc.encode(newMark, {
  attribute: "Response",
  channel: "fillColor",
  mapping: {
    "Strongly agree": "#1e71b8",
    "Agree": "#7799cf",
    "Disagree": "#e29d6f",
    "Strongly disagree": "#da7c43"
  }
});

// Align only selected response bars to form the diverging center.
let agreeBars = msc.findElements(scn, [
  {attribute: "Response", value: "Agree"}
]);
msc.align(agreeBars, "x", "right");

let labels = scn.mark("text", {
  fillColor: "#333",
  fontSize: "11px"
});

msc.repeat(labels, dt);
msc.encode(labels, {
  attribute: "Percentage",
  channel: "text"
});
msc.affix(labels, newMark, "x");
msc.affix(labels, newMark, "y");

scn.axis("y", "Age Group", {
  orientation: "left",
  pathVisible: false,
  tickVisible: false,
  titleVisible: false
});
scn.legend("fillColor", "Response", {x: 720, y: 100});

msc.renderer("svg", "svgElement").render(scn);
```

Why this works:

- `msc.repeat` creates one row per age group.
- `msc.divide` creates one segment per response inside each row.
- `msc.encode` maps data to segment width and color.
- `msc.findElements` selects one response class for special alignment.
- `msc.affix` keeps labels attached to generated segments.

## Example 2: Connected Scatterplot

Start with a styled line. `msc.densify` turns it into a multi-point path, and the generated vertices are encoded with the data values.

```js
let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/drivingShifts.csv");

let line = scn.mark("line", {
  x1: 100,
  y1: 400,
  x2: 700,
  y2: 400,
  strokeColor: "#d62728",
  strokeWidth: 3
});

// Densify transforms the seed line into a path with data-bound vertices.
let path = msc.densify(line, dt);
path.curveMode = "natural";

msc.encode(path.firstVertex, {
  attribute: "miles",
  channel: "x"
});

msc.encode(path.firstVertex, {
  attribute: "gas",
  channel: "y"
});

scn.axis("x", "miles", {
  orientation: "top",
  pathVisible: false
});
scn.axis("y", "gas", {
  orientation: "left",
  pathVisible: false
});
scn.gridlines("x", "miles");
scn.gridlines("y", "gas");

msc.renderer("svg", "svgElement").render(scn);
```

Why this works:

- The seed line defines the initial mark style.
- `msc.densify` creates the data-driven path.
- Encodings are applied to `path.firstVertex` because the generated vertices determine the path shape.
- Axes and gridlines are added after the encodings exist.

## Example 3: Multiple Bar Charts

In this example, the first repeat creates one chart group per state. The divide step creates the yearly bars inside each group, and encoded coordinates place the groups on a map-like layout.

```js
let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/us_state_unemployment_final.csv");

let rect = scn.mark("rect", {
  left: 100,
  top: 100,
  width: 160,
  height: 120,
  fillColor: "#8dd3c7",
  strokeWidth: 0
});

// Repeat creates one mini chart per state.
msc.repeat(rect, dt, {attribute: "State"});

// Divide each state rectangle into bars by year.
let {newMark: yearBar, collection: stateBarGroups} = msc.divide(rect, dt, {
  attribute: "Year",
  orientation: "horizontal"
});

msc.encode(stateBarGroups, {
  attribute: "MapX",
  channel: "x",
  rangeExtent: 950
});

msc.encode(stateBarGroups, {
  attribute: "MapY",
  channel: "y",
  rangeExtent: 550
});

msc.encode(yearBar, {
  attribute: "Unemployment",
  channel: "height"
});

msc.encode(yearBar, {
  attribute: "US Avg",
  channel: "fillColor",
  mapping: {
    "Above Average": "#D0605E",
    "Below Average": "#6A9F58"
  }
});

let labels = scn.mark("text", {
  text: "",
  fontSize: "11px",
  fillColor: "#555"
});

msc.repeat(labels, dt, {attribute: "State"});
msc.encode(labels, {
  attribute: "State",
  channel: "text"
});
msc.affix(labels, stateBarGroups, "x");
msc.encode(labels, {
  attribute: "MapY",
  channel: "y",
  rangeExtent: 550
});

scn.legend("fillColor", "US Avg", {x: 760, y: 100});

msc.renderer("svg", "svgElement").render(scn);
```

Why this works:

- The state-level repeat creates small multiples.
- The year-level divide creates bars inside each repeated chart.
- Encodings on the divided collection position the small multiples geographically.
- Labels are generated separately and affixed to the divided bar groups.

## Example 4: Stacked Area Chart

For a stacked area chart, start from a rectangle, densify it into an area mark, divide that area by category, and encode the generated vertices over time.

```js
let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/unemployment-2.csv");

let rect = scn.mark("rect", {
  left: 100,
  top: 100,
  width: 700,
  height: 360,
  fillColor: "#ddd",
  strokeWidth: 0
});

// A rectangle can be densified into an area mark.
let area = msc.densify(rect, dt, {
  orientation: "horizontal",
  attribute: "date"
});

// Divide the area into one band per industry.
let {newMark: industryArea} = msc.divide(area, dt, {
  orientation: "vertical",
  attribute: "industry"
});

msc.encode(industryArea, {
  attribute: "industry",
  channel: "fillColor",
  mapping: {
    "Manufacturing": "#7fc97f",
    "Leisure and hospitality": "#beaed4",
    "Business services": "#fdc086",
    "Construction": "#ffff99"
  }
});

msc.encode(industryArea, {
  attribute: "unemployments",
  channel: "height"
});

let xEncoding = msc.encode(industryArea.topLeftVertex, {
  attribute: "date",
  channel: "x",
  rangeExtent: 700
});

msc.encode(industryArea.bottomLeftVertex, {
  attribute: "date",
  channel: "x",
  shareScale: xEncoding
});

scn.axis("x", "date", {orientation: "bottom"});
scn.axis("height", "unemployments", {orientation: "left"});
scn.legend("fillColor", "industry", {x: 820, y: 100});

msc.renderer("svg", "svgElement").render(scn);
```

Why this works:

- `msc.densify` creates the area geometry from a rectangle seed.
- `msc.divide` splits that area into category bands.
- Vertex encodings control the shape of each area band.
- The legend is created from the `fillColor` encoding.
