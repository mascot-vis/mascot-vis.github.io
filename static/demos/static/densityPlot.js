let scene = msc.scene();
let csv = await msc.csv("/datasets/csv/car-weight.csv");
// let data = csv.transform("kde", ["weight(lbs)"], {min: 1500, interval: 100, bandwidth: 10});
let data = scene.transform("kde", csv, {attribute: "weight(lbs)", newAttribute: "weight_density", min: 1500, interval: 100, bandwidth: 10});

let rect = scene.mark("rect", {top:60, left: 200, width: 700, height: 400, strokeColor: "#222", strokeWidth: 1, fillColor: "orange", opacity: 0.75});
let pg = msc.densify(rect, data, {orientation: "horizontal", attribute: "weight(lbs)"});
msc.encode(pg.topLeftVertex, {channel: "x", attribute: "weight(lbs)"});
msc.encode(pg.bottomLeftVertex, {channel: "x", attribute: "weight(lbs)"});
msc.encode(pg, {channel: "height", attribute: "weight_density"});
pg.curveMode = "basis";

scene.axis("x", "weight(lbs)", {orientation: "bottom"});
scene.axis("height", "weight_density", {orientation: "left", titleOffset: 60, labelFormat: ".2s"});