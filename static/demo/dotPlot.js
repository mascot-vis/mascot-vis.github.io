let scene = msc.scene();
let dt = await msc.csv("csv/waffle.csv");

let circle = scene.mark("circle", {x:200, y: 100, radius: 8, fillColor: "orange"});
let coll = scene.repeat(circle, dt);
let colls = scene.classify(coll.children, "Age Bin", scene);
scene.encode(colls[0], {field: "Age Bin", channel: "x", rangeExtent: 500});
scene.setProperties(colls[0], {layout: msc.layout("stack", {orientation: "vertical"})});
scene.align(colls, "bottom");
scene.axis("x", "Age Bin", {orientation: "bottom"});

// let r = msc.renderer("svg");
// r.render(scene, "svgElement", {collectionBounds: false});