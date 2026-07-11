let scene = msc.scene();
let csv = await msc.csv("/datasets/csv/iris_setosa.csv");
let data = scene.derive(csv, msc.transform("kde", {attribute: "sepal_length", newAttribute: "sepal_length_density", min: 4, interval: 0.1, max: 6, bandwidth: 0.13}));
let rect = scene.mark("rect", {top:60, left: 200, width: 200, height: 400, strokeColor: "white", strokeWidth: 1, fillColor: "#69B3A2"});
let setose = msc.densify(rect, data, {orientation: "vertical", attribute: "sepal_length"});
msc.update(setose, {baseline: "center", curveMode: "basis"});
let yEnc = msc.encode(setose.topLeftVertex, "y", "sepal_length");
msc.encode(setose.topRightVertex, "y", "sepal_length", {shareScale: yEnc});
let wdEnc = msc.encode(setose, "width", "sepal_length_density");
yEnc.rangeExtent = 400;
scene.axis("y", "sepal_length", {orientation: "left"});
let line = scene.mark("line", {x1: 300, y1: 20, x2: 300, y2: 480, strokeColor: "#555", strokeWidth: 2}),
    box = scene.mark("rect", {top: 70, left: 295, width: 10, height: 400, fillColor: "black", strokeColor: "#111"}),
    medianCircle = scene.mark("circle", {radius: 4, x: 300, y: 90, fillColor: "white", strokeWidth: 0});

let glyph = scene.glyph(line, box, medianCircle);
// msc.repeat(glyph, csv, {attribute: "species"});
msc.attach(glyph, csv);
msc.encode(line.vertices[0], "y", "sepal_length", {aggregator: "max", shareScale: yEnc});
msc.encode(line.vertices[1], "y", "sepal_length", {aggregator: "min", shareScale: yEnc});
msc.encode(box.topSegment, "y", "sepal_length", {aggregator: "percentile 75", shareScale: yEnc});
msc.encode(box.bottomSegment, "y", "sepal_length", {aggregator: "percentile 25", shareScale: yEnc});
msc.encode(medianCircle, "y", "sepal_length", {aggregator: "avg", shareScale: yEnc})
