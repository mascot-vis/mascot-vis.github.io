let scene = msc.scene();
let data = await msc.csv("/datasets/csv/unemployment-2_gender_included.csv");

let rect = scene.mark("rect", {top:60, left: 100, width: 400, height: 150, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});
let industries = scene.repeat(rect, data, {attribute: "industry"});
industries.layout = msc.layout("grid", {numRows: 2, colGap: 60, rowGap: 30});
let anyArea = scene.densify(industries.firstChild, data, {orientation: "horizontal", attribute: "date"});
let {newMark:area, collection:areas} = scene.divide(anyArea, data, {orientation: "vertical", attribute: "gender"});

scene.encode(area, {channel: "fillColor", attribute: "gender", mapping: {"male": "#60bdf0", "female": "#f768a1"}});
let htEncoding = scene.encode(area, {channel: "height", attribute: "unemployments"});
let xEnc = scene.encode(area.topLeftVertex, {channel: "x", attribute: "date", rangeExtent: 400});
scene.encode(area.bottomLeftVertex, {channel: "x", attribute: "date", shareScale: xEnc});
htEncoding.domain = [0,4500];
htEncoding.rangeExtent = 200;

scene.axis("x", "date", {orientation: "bottom", labelFormat: "%b %y"});
scene.axis("height", "unemployments", {orientation: "left", labelFormat: ".2s", titleOffset: 50, titleVisible: false});
scene.legend("fillColor", "gender", {x: 980, y: 100});

//to align the area marks to top/middle, we need to set the vertCellAlignment properties for both the stack and grid layouts
// scene.setProperties(areas.layout, {"vertCellAlignment": "middle"});
// scene.setProperties(industries.layout, {"vertCellAlignment": "middle"});