let scn = msc.scene();
let line = scn.mark("line", {x1: 100, y1: 100, x2: 700, y2: 400, strokeColor: "#008BBE", strokeWidth: 2, vxShape: "circle", vxRadius: 1, vxFillColor: "#008BBE"});
// let dt = await msc.csv("/datasets/csv/tempForecast.csv");
let dt = await msc.csv("/datasets/csv/bostonWeather.csv");

let rect = scn.mark("rect", {left: 100, top: 100, width: 600, height: 300, fillColor: "#E3F3FC", strokeWidth: 0});
// let area = scn.densify(rect, dt, {attribute: "month", "orientation": "horizontal"});
let area = scn.densify(rect, dt, {attribute: "date", "orientation": "horizontal"});
area.curveMode = "natural";

//area.topLeftVertex.fillColor = "red";
// area.bottomLeftVertex.fillColor = "red";
// area.topRightVertex.fillColor = "red";
// area.bottomRightVertex.fillColor = "red";

let xEnc = scn.encode(area.topLeftVertex, {attribute: "date", channel: "x", rangeExtent: 600});
scn.encode(area.bottomLeftVertex, {attribute: "date", channel: "x", shareScale: xEnc});
xEnc.rangeExtent = 800;
let yEnc = scn.encode(area.topLeftVertex, {attribute: "maxTemp", channel: "y", includeZero: true});
scn.encode(area.bottomLeftVertex, {attribute: "minTemp", channel: "y", shareScale: yEnc});

let polyLine = scn.densify(line, dt, {attribute: "date"});
polyLine.curveMode = "natural";
let vertex = polyLine.firstVertex;

scn.encode(vertex, {attribute: "date", channel: "x", shareScale: xEnc});
scn.encode(vertex, {attribute: "meanTemp", channel: "y", shareScale: yEnc});

scn.axis("x", "date", {orientation: "bottom", labelFormat: "%b %d"});
scn.axis("y", "meanTemp", {orientation: "left"});
scn.gridlines("x", "date");
scn.gridlines("y", "meanTemp");
yEnc.rangeExtent = 400;