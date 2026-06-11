# Mascot.js Allowed API Reference

Only use APIs listed in this file when generating Mascot.js code. Do not invent methods, classes, properties, or signatures. Prefer the current top-level function style, for example `msc.encode(...)`, `msc.repeat(...)`, and `msc.affix(...)`.

## Module-Level Constructors and Data Loading

```js
let scn = msc.scene(params);
let layout = msc.layout(type, params);
let table = msc.table(args);

let csvTable = await msc.csv(url);
let tableFromString = msc.csvString(csvText);
let graph = await msc.graphJSON(url);
let tree = await msc.treeJSON(url);
```

Supported layout type strings include:

`grid`, `stack`, `packing`, `force`, `directedgraph`, `tidytree`, `treemap`, `strata`, `circular`, and `cluster`.

Common layout direction and orientation strings include:

`horizontal`, `vertical`, `angular`, `radial`, `l2r`, `r2l`, `t2b`, `b2t`, `clockwise`, `anti-clockwise`, `inward`, and `outward`.

## Scene Methods

```js
let mark = scn.mark(type, params);
let glyph = scn.glyph(...marks);
let composite = scn.composite();

let axis = scn.axis(channel, attribute, params);
let gridlines = scn.gridlines(channel, attribute, params);
let legend = scn.legend(channel, attribute, params);

scn.mask(element);
scn.setLayout(group, layout);
scn.transform(type, table, args);

let element = scn.getElement(id);
let axis = scn.getAxis(attribute, channel);
```

Direct mark type strings:

`rect`, `circle`, `line`, `ring`, `path`, `image`, `text`, `richText`, `arc`, `bezierCurve`, `bundledPath`, and `chord`.

Do not create marks from the top-level Mascot module. Marks are created from a scene with `scn.mark(...)`.

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
  flipScale: false
}
```

Common channels used in current examples:

`x`, `y`, `width`, `height`, `area`, `radius`, `radialDistance`, `angle`, `text`, `fillColor`, `strokeColor`, `strokeWidth`, `fillGradient`, and `src`.

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
