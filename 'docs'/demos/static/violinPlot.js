let scene = msc.scene();
let csv = await msc.csv("/datasets/csv/iris_setosa.csv");
let data = scene.transform("kde", csv, {attribute: "sepal_length", newAttribute: "sepal_length_density", min: 4, interval: 0.1, max: 6, bandwidth: 0.13});
let rect = scene.mark("rect", {top:60, left: 200, width: 200, height: 400, strokeColor: "white", strokeWidth: 1, fillColor: "#69B3A2"});
let setose = scene.densify(rect, data, {orientation: "vertical", attribute: "sepal_length"});
scene.setProperties(setose, {baseline: "center", curveMode: "basis"});
let yEnc = scene.encode(setose.topLeftVertex, {channel: "y", attribute: "sepal_length"});
scene.encode(setose.topRightVertex, {channel: "y", attribute: "sepal_length", shareScale: yEnc});
let wdEnc = scene.encode(setose, {channel: "width", attribute: "sepal_length_density"});
yEnc.rangeExtent = 400;
scene.axis("y", "sepal_length", {orientation: "left"});
let line = scene.mark("line", {x1: 300, y1: 20, x2: 300, y2: 480, strokeColor: "#555", strokeWidth: 2}),
    box = scene.mark("rect", {top: 70, left: 295, width: 10, height: 400, fillColor: "black", strokeColor: "#111"}),
    medianCircle = scene.mark("circle", {radius: 4, x: 300, y: 90, fillColor: "white", strokeWidth: 0});

let glyph = scene.glyph(line, box, medianCircle);
// scene.repeat(glyph, csv, {attribute: "species"});
scene.attach(glyph, csv);
scene.encode(line.vertices[0], {attribute: "sepal_length", channel: "y", aggregator: "max", shareScale: yEnc});
scene.encode(line.vertices[1], {attribute: "sepal_length", channel: "y", aggregator: "min", shareScale: yEnc});
scene.encode(box.topSegment, {attribute: "sepal_length", channel: "y", aggregator: "percentile 75", shareScale: yEnc});
scene.encode(box.bottomSegment, {attribute: "sepal_length", channel: "y", aggregator: "percentile 25", shareScale: yEnc});
scene.encode(medianCircle, {attribute: "sepal_length", channel: "y", aggregator: "avg", shareScale: yEnc})
