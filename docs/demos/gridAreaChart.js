let scene = msc.scene();
let data = await msc.csv("datasets/csv/unemployment-2.csv");

let rect = scene.mark("rect", {top:60, left: 100, width: 400, height: 150, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});
let industries = scene.repeat(rect, data, {field: "industry"});
industries.layout = msc.layout("grid", {numRows: 2, colGap: 65, rowGap: 55});
let anyArea = scene.densify(industries.firstChild,  data, {orientation: "horizontal", field: "date"});
scene.encode(anyArea, {channel: "fillColor", field: "industry"});
//to align the area marks to top/middle, we need to set both the area marks' baseline and the grid layout's vertCellAlignment
// scene.setProperties(anyArea, {"baseline": "middle"});
// scene.setProperties(industries.layout, {"vertCellAlignment": "middle"});
let disEncoding = scene.encode(anyArea, {channel: "height", field: "unemployments"});
scene.encode(anyArea.firstVertexPair, {channel: "x", field: "date"});
disEncoding.scale.domain = [0,2500];
disEncoding.scale.rangeExtent = 200;
for (let area of industries.children){
    scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y", item: area.firstVertex});
	scene.axis("height", "unemployments", {orientation: "left", labelFormat: ".2s", item: area});
}
scene.legend("fillColor", "industry", {x: 980, y: 100});