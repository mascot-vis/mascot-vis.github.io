let scene = msc.scene();
let dt = await msc.csv("/datasets/csv/waffle.csv");

let circle = scene.mark("circle", {x:200, y: 100, radius: 8, fillColor: "orange"});
let coll = scene.repeat(circle, dt);
scene.classify(coll, {attribute: "Age Bin", layout: msc.layout("stack", {orientation: "vertical"})});
// scene.encode(coll.firstChild, {attribute: "Age Bin", channel: "x", rangeExtent: 500});
scene.setLayout(coll, msc.layout("grid", {"numRows": 1, "colGap": 80}));
//scene.align(coll.children, "bottom");
scene.axis("x", "Age Bin", {orientation: "bottom"});