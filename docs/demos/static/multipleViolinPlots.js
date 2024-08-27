let scene = msc.scene();
let csv = await msc.csv("/datasets/csv/iris_species.csv");
let data = scene.transform("kde", csv, {attribute: "sepal_length", newAttribute: "sepal_length_density", groupBy: ["species"], min: 3, interval: 0.1, max: 8, bandwidth: 0.25});
let rect = scene.mark("rect", {top:60, left: 200, width: 200, height: 400, strokeColor: "white", strokeWidth: 1, fillColor: "#69B3A2"});
let species = scene.repeat(rect, data, {attribute: "species"})
species.layout = msc.layout("grid", {numCols: 3, rowGap: 15, "horzCellAlignment": "center" });
let area = scene.densify(rect, data, {orientation: "vertical", attribute: "sepal_length"});
let yEnc = scene.encode(area.topLeftVertex, {channel: "y", attribute: "sepal_length"});
scene.encode(area.topRightVertex, {channel: "y", attribute: "sepal_length", shareScale: yEnc})
scene.encode(area, {channel: "width", attribute: "sepal_length_density"});
scene.encode(area, {channel: "fillColor", attribute: "species"});
scene.setProperties(area, {curveMode: "basis", baseline: "center"})
scene.axis("x", "species", {orientation: "bottom", pathVisible: false, tickVisible: false});
scene.axis("y", "sepal_length", {orientation: "right", pathX: 800});
scene.legend("fillColor", "species", {x: 200, y: 50});

//TODO: try putting the area and the other marks into one glyph

let line = scene.mark("line", {x1: 300, y1: 20, x2: 300, y2: 480, strokeColor: "#555", strokeWidth: 2}),
    box = scene.mark("rect", {top: 70, left: 295, width: 10, height: 400, fillColor: "black", strokeColor: "#111"}),
    medianCircle = scene.mark("circle", {radius: 4, x: 300, y: 90, fillColor: "white", strokeWidth: 0});

let glyph = scene.glyph(line, box, medianCircle);
let collection = scene.repeat(glyph, csv, {attribute: "species"});
collection.layout = msc.layout("grid", {numCols: 3});
scene.encode(line.vertices[0], {attribute: "sepal_length", channel: "y", aggregator: "max", shareScale: yEnc});
scene.encode(line.vertices[1], {attribute: "sepal_length", channel: "y", aggregator: "min", shareScale: yEnc});
scene.encode(box.topSegment, {attribute: "sepal_length", channel: "y", aggregator: "percentile 75", shareScale: yEnc});
scene.encode(box.bottomSegment, {attribute: "sepal_length", channel: "y", aggregator: "percentile 25", shareScale: yEnc});
scene.encode(medianCircle, {attribute: "sepal_length", channel: "y", aggregator: "avg", shareScale: yEnc})
scene.affix(glyph, area, "x");
