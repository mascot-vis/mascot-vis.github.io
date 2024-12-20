let scene = msc.scene();
let data = await msc.csv("datasets/csv/unemployment-2_gender_included.csv");

let rect = scene.mark("rect", {top:60, left: 100, width: 400, height: 150, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});
let industries = scene.repeat(rect, data, {field: "industry"});
industries.layout = msc.layout("grid", {numRows: 2, colGap: 15, rowGap: 30});
let anyArea = scene.densify(industries.firstChild, data, {orientation: "horizontal", field: "date"});
let areas = scene.divide(anyArea, data, {orientation: "vertical", field: "gender"});
scene.encode(areas.firstChild, {channel: "fillColor", field: "gender", mapping: {"male": "#60bdf0", "female": "#f768a1"}});
let disEncoding = scene.encode(areas.firstChild, {channel: "height", field: "unemployments"});
scene.encode(areas.firstChild.firstVertexPair, {channel: "x", field: "date", rangeExtent: 400});
disEncoding.scale.domain = [0,4500];
disEncoding.scale.rangeExtent = 200;
//to align the area marks to top/middle, we need to set the vertCellAlignment properties for both the stack and grid layouts
// scene.setProperties(areas.layout, {"vertCellAlignment": "middle"});
// scene.setProperties(industries.layout, {"vertCellAlignment": "middle"});
scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y"});
scene.axis("height", "unemployments", {orientation: "left", pathX: 90, labelFormat: ".2s", titleOffset: 50});
scene.legend("fillColor", "gender", {x: 980, y: 100});