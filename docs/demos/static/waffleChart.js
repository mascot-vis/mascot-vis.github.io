let scene = msc.scene();
let dt = await msc.csv("/datasets/csv/waffle.csv");


let rect = scene.mark("rect", {top:100, left: 200, width: 20, height: 20, strokeWidth: 0, opacity: 0.8});
let c = scene.repeat(rect, dt);
c.layout = msc.layout("grid", {numCols: 10, rowGap: 2, colGap: 2});
scene.encode(rect, {"attribute": "Age Bin", channel: "fillColor"});
scene.setProperties(rect, {"width": 30, "height": 30});
scene.legend("fillColor", "Age Bin", {x: 600, y: 120});

// let r1 = scene.mark("rect", { top: 220, left: 600, width: 12, height: 12, fillColor: "orange", strokeWidth: 0}),
//     text = scene.mark("text", {x: 620, y: 220, text: "ADfa", "anchor": ["left", "top"]});
// let g = scene.glyph(r1, text);
// let coll = scene.repeat(g, dt, {"attribute": "Age Bin"});
// coll.layout = msc.layout("grid", {numCols: 1, rowGap: 12, colGap: 2});

// let r = msc.renderer("svg");
// r.render(scene, "svgElement", {collectionBounds: false});