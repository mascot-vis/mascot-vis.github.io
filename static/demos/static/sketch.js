let scn = msc.scene();
let dt = await msc.csv("datasets/csv/sketch.csv");
let circle = scn.mark("circle", {radius: 6, x: 100, y: 80, fillColor: "orange", strokeWidth: 0});
let collection = scn.repeat(circle, dt);
let xEncoding = scn.encode(circle, {field: "x", channel: "x"});
let yEncoding = scn.encode(circle, {field: "y", channel: "y"});
xEncoding.scale.domain = [1, 7];
yEncoding.scale.domain = [0, 10];
xEncoding.scale.rangeExtent = 450;
yEncoding.scale.rangeExtent = 250;

scn.axis("x", "x", {orientation: "bottom", pathY: 400, tickValues: [1, 2]});
scn.axis("y", "y", {orientation: "left", tickValues: [6, 7]});
scn.gridlines("x", "x", {values: [1, 2]});
msc.renderer('svg','svgElement').render(scn);