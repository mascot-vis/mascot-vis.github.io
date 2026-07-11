let scn = msc.scene();
let line = scn.mark("line", {x1: 100, y1: 100, x2: 700, y2: 400, strokeColor: "#008BBE", strokeWidth: 2, vxShape: "circle", vxRadius: 1, vxFillColor: "#008BBE"});
// let dt = await msc.csv("/datasets/csv/tempForecast.csv");
let dt = await msc.csv("/datasets/csv/bostonWeather.csv");

let rect = scn.mark("rect", {left: 100, top: 100, width: 600, height: 300, fillColor: "#E3F3FC", strokeWidth: 0});
// let area = msc.densify(rect, dt, {attribute: "month", "orientation": "horizontal"});
let area = msc.densify(rect, dt, {attribute: "date", "orientation": "horizontal"});
area.curveMode = "natural";

//area.topLeftVertex.fillColor = "red";
// area.bottomLeftVertex.fillColor = "red";
// area.topRightVertex.fillColor = "red";
// area.bottomRightVertex.fillColor = "red";

let xEnc = msc.encode(area.topLeftVertex, "x", "date", {rangeExtent: 600});
msc.encode(area.bottomLeftVertex, "x", "date", {shareScale: xEnc});
xEnc.rangeExtent = 800;
let yEnc = msc.encode(area.topLeftVertex, "y", "maxTemp", {includeZero: true});
msc.encode(area.bottomLeftVertex, "y", "minTemp", {shareScale: yEnc});

let polyLine = msc.densify(line, dt, {attribute: "date"});
polyLine.curveMode = "natural";
let vertex = polyLine.firstVertex;

msc.encode(vertex, "x", "date", {shareScale: xEnc});
msc.encode(vertex, "y", "meanTemp", {shareScale: yEnc});

scn.axis("x", "date", {orientation: "bottom", labelFormat: "%b %d"});
scn.axis("y", "meanTemp", {orientation: "left"});
scn.gridlines("x", "date");
scn.gridlines("y", "meanTemp");
yEnc.rangeExtent = 400;