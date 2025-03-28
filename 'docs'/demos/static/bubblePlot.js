let scn = msc.scene({fillColor: "#333"});
let dt = await msc.csv("/datasets/csv/planets.csv");
let circle = scn.mark("circle", {radius: 6, x: 200, y: 60, fillColor: "orange", strokeWidth: 1, strokeColor: "white", opacity: 0.3});

let collection = scn.repeat(circle, dt, { attribute: "name" });

let xEncoding = scn.encode(circle, { attribute: "hzd", channel: "x" });
let yEncoding = scn.encode(circle, { attribute: "mass", channel: "y", flipScale: true, scaleType: "log" });
let sizeEnc = scn.encode(circle, { attribute: "radius", channel: "radius" });
let fillEncoding = scn.encode(circle, { attribute: "hzd", channel: "fillColor", scheme: "interpolateRdYlBu" });

xEncoding.rangeExtent = 500;
yEncoding.rangeExtent = 600;
sizeEnc.rangeExtent = 40;

scn.axis("x", "hzd", { orientation: "bottom", strokeColor: "#ccc", textColor: "#ccc" });
// scn.axis("y", "mass", {orientation: "left", tickValues: [0.1, 1, 10, 100, 1000, 10000], strokeColor: "#ccc", textColor: "#ccc"});
scn.axis("y", "mass", { orientation: "left", strokeColor: "#ccc", textColor: "#ccc" });
scn.gridlines("x", "hzd", { strokeColor: "#555" });
scn.gridlines("y", "mass", { values: [0.1, 1, 10, 100, 1000, 10000], strokeColor: "#555" });
scn.legend("fillColor", "hzd", {x: 750, y: 100, textColor: "#eee"});