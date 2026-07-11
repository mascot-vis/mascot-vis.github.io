let scene = msc.scene();
let data = await msc.csv("/datasets/csv/unemployment-2.csv");
let rect = scene.mark("rect", {top:60, left: 100, width: 560, height: 450, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#eee"});

// // rect.divide first
// let industries = msc.divide(rect, {"partitionType":'divide', "orientation": "horizontal", "attribute": "industry", "datatable": data});
// let anyArea = msc.divide(industries.firstChild, {"partitionType":'BoundaryPartition', "orientation": "horizontal", "attribute": "date", "datatable": data});

// rect.densify first
let anyArea = msc.densify(rect, data, {orientation: "horizontal", attribute: "date"});
let {newMark:area, collection:areas} = msc.divide(anyArea, data, {orientation: "vertical", attribute: "industry"});
let htEnc = msc.encode(area, "height", "unemployments");
msc.encode(area, "fillColor", "industry");
let yEnc = msc.encode(area.topLeftVertex, "x", "date");
msc.encode(area.bottomLeftVertex, "x", "date", {shareScale: yEnc});
// // htEnc.scale.domain = [0,8000];
// htEnc.rangeExtent = 150;
msc.update(areas.layout, {vertCellAlignment: "middle"});

scene.axis("x", "date", {orientation: "bottom", pathY: 525, labelFormat: "%Y"});
scene.axis("height", "unemployments", {"orientation": "left", titleVisible: false});
scene.legend("fillColor", "industry", {x: 680, y: 100});