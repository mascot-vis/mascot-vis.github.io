let scene = msc.scene();
let data = await msc.csv("/datasets/csv/unemployment-2.csv");

let rect = scene.mark("rect", {top:60, left: 100, width: 400, height: 150, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});
let industries = msc.repeat(rect, data, {attribute: "industry"});
industries.layout = msc.layout("grid", {numRows: 2, colGap: 65, rowGap: 55});
let anyArea = msc.densify(industries.firstChild,  data, {orientation: "horizontal", attribute: "date"});
msc.encode(anyArea, "fillColor", "industry");
//to align the area marks to top/middle, we need to set both the area marks' baseline and the grid layout's vertCellAlignment
// msc.update(anyArea, {"baseline": "middle"});
// msc.update(industries.layout, {"vertCellAlignment": "middle"});
let htEnc = msc.encode(anyArea, "height", "unemployments");
let xEnc = msc.encode(anyArea.topLeftVertex, "x", "date");
msc.encode(anyArea.bottomLeftVertex, "x", "date", {shareScale: xEnc});
htEnc.domain = [0,2500];
htEnc.rangeExtent = 200;
// for (let area of industries.children){
//     scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y", element: area.firstVertex});
// 	scene.axis("height", "unemployments", {orientation: "left", labelFormat: ".2s", element: area});
// }
scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y"});
scene.axis("height", "unemployments", {orientation: "left", labelFormat: ".2s"});
scene.legend("fillColor", "industry", {x: 980, y: 100});