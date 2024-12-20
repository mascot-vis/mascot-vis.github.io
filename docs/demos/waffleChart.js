let scene = msc.scene();
let dt = await msc.csv("datasets/csv/waffle.csv");

let rect = scene.mark("rect", {top:100, left: 200, width: 20, height: 20, strokeWidth: 0, opacity: 0.8});
let c = scene.repeat(rect, dt);
c.layout = msc.layout("grid", {numCols: 10, rowGap: 2, colGap: 2});
scene.encode(rect, {field: "Age Bin", channel: "fillColor"});
scene.legend("fillColor", "Age Bin", {x: 500, y: 120});

// let r = msc.renderer("svg");
// r.render(scene, "svgElement", {collectionBounds: false});