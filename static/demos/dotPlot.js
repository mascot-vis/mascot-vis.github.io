let scene = msc.scene();
let dt = await msc.csv("datasets/csv/waffle.csv");

let circle = scene.mark("circle", {x:200, y: 100, radius: 8, fillColor: "orange"});
let coll = scene.repeat(circle, dt);
scene.classify(coll, {field: "Age Bin", layout: msc.layout("stack", {orientation: "vertical"})});
scene.encode(coll.firstChild, {field: "Age Bin", channel: "x", rangeExtent: 500});
scene.align(coll.children, "bottom");
scene.axis("x", "Age Bin", {orientation: "bottom"});

// let r = msc.renderer("svg");
// r.render(scene, "svgElement", {collectionBounds: false});