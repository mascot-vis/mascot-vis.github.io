# Mascot.js Concepts

Use this file as the mental model for generating Mascot.js code. Mascot's API has changed over time, so rely on this prompt pack and the current source-backed examples instead of older online snippets.

## Scene

A scene is the top-level container for a visualization. Create one with `msc.scene()`.

The scene owns marks, glyphs, collections, axes, gridlines, legends, encodings, constraints, and interaction definitions. Most static chart code starts with a scene and one or two prototype marks, then expands those prototypes into a full visualization with data-driven operations.

## Marks

A mark is a primitive visual object, such as a rectangle, circle, line, path, text label, or arc. Marks are created from the scene:

```js
let rect = scn.mark("rect", {
  left: 100,
  top: 80,
  width: 40,
  height: 20,
  fillColor: "#69b3a2"
});
```

The direct mark types currently supported in the public API are:

`rect`, `circle`, `line`, `ring`, `path`, `image`, `text`, `richText`, `arc`, `bezierCurve`, `bundledPath`, and `chord`.

Some operations produce specialized marks from simpler marks. For example, `msc.densify` can transform a line into a path, a rectangle into an area, or a circle into a polygon.

## Glyphs

A glyph is a reusable visual unit made from multiple marks. Use a glyph when each data item should be represented by a compound symbol instead of a single primitive mark.

```js
let circle = scn.mark("circle", {x: 100, y: 100, radius: 6});
let label = scn.mark("text", {x: 112, y: 100, text: "A"});
let glyph = scn.glyph(circle, label);
```

After a glyph is created, it can be repeated or otherwise transformed as a single element.

## Collections

A collection is a group of related visual elements, usually created by data operations such as `msc.repeat` or `msc.divide`.

Collections are important because layout is usually applied to collections, not to individual generated marks:

```js
let coll = msc.repeat(rect, table, {attribute: "category"});
coll.layout = msc.layout("grid", {numCols: 1, rowGap: 8});
```

When an operation creates many peers from a prototype element, Mascot keeps track of those peer relationships. Later encodings, constraints, and queries can then work with the generated structure without manually looping over every mark.

## Data

Most examples use tabular data loaded with `await msc.csv(url)`. Data-driven operations bind rows or groups of rows to marks and collections.

Common data flow:

1. Load a table.
2. Create one prototype mark or glyph.
3. Generate a collection from that prototype with `msc.repeat`, `msc.divide`, or `msc.densify`.
4. Apply layout, encodings, constraints, and guides.

## Encoding

An encoding maps a data attribute to a visual channel. Use the top-level function `msc.encode`, not a scene method:

```js
msc.encode(rect, {
  attribute: "value",
  channel: "height"
});
```

Common channels in current examples include `x`, `y`, `width`, `height`, `area`, `radius`, `radialDistance`, `angle`, `text`, `fillColor`, `strokeColor`, `strokeWidth`, `fillGradient`, and `src`.

An encoding call returns an encoding object. Code can adjust that object when needed, for example by setting `rangeExtent` or sharing its scale with another encoding.

## Layout

Layouts arrange collections. Create a layout with `msc.layout(type, params)` and assign it to a collection's `layout` property.

```js
coll.layout = msc.layout("grid", {
  numCols: 1,
  rowGap: 5
});
```

Static chart code should usually create or derive the collection first, then apply the layout, then encode marks or generated elements.

## Guides

Axes, gridlines, and legends are created from the scene after relevant encodings exist:

```js
scn.axis("x", "value", {orientation: "bottom"});
scn.gridlines("y", "category");
scn.legend("fillColor", "group", {x: 700, y: 100});
```

Guides depend on encodings, so add them after the chart's visual channels are mapped.

## Data-Driven Operations

Mascot uses operations to turn a small visual seed into a complete chart:

- `msc.repeat` creates peers of a mark, glyph, or collection from data.
- `msc.divide` partitions a mark into smaller marks, often for stacked bars or grouped bars.
- `msc.densify` adds vertices to a simple mark, often creating paths, areas, or polygons.
- `msc.classify`, `msc.stratify`, `msc.attach`, and `msc.repopulate` support additional data binding and restructuring workflows.

These are top-level `msc` functions. Do not call removed scene methods for repeat, divide, or densify.

## Constraints and Connections

Constraints position elements relative to other elements:

- `msc.affix` positions an element relative to a base element.
- `msc.align` aligns a set of elements along a channel and anchor.
- `msc.connect` connects node marks and link marks when working with graph-like structures.

Constraints are usually applied after generated marks exist and after basic encodings are set.

## Queries and Peers

Use `msc.findElements`, `msc.getPeers`, and `msc.getLeafMarks` to locate generated elements.

`msc.findElements` accepts predicates such as data attribute/value pairs or element property/value pairs:

```js
let bars = msc.findElements(scn, [
  {attribute: "Response", value: "Agree"}
]);
```

This is useful when only part of a generated chart needs alignment, styling, labeling, or interaction.

## Rendering

For browser examples, render the scene with the SVG renderer:

```js
msc.renderer("svg", "svgElement").render(scn);
```

The second argument is the DOM id of the target SVG container.
