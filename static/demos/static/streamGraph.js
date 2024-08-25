let scene = msc.scene();
let data = await msc.csv("/datasets/csv/unemployment-2.csv");
let rect = scene.mark("rect", {top:60, left: 100, width: 560, height: 450, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#eee"});

// // rect.divide first
// let industries = scene.divide(rect, {"partitionType":'divide', "orientation": "horizontal", "attribute": "industry", "datatable": data});
// let anyArea = scene.divide(industries.firstChild, {"partitionType":'BoundaryPartition', "orientation": "horizontal", "attribute": "date", "datatable": data});

// rect.densify first
let anyArea = scene.densify(rect, data, {orientation: "horizontal", attribute: "date"});
let {newMark:area, collection:areas} = scene.divide(anyArea, data, {orientation: "vertical", attribute: "industry"});
let htEnc = scene.encode(area, {channel: "height", attribute: "unemployments"});
scene.encode(area, {channel: "fillColor", attribute: "industry"});
let yEnc = scene.encode(area.topLeftVertex, {channel: "x", attribute: "date"});
scene.encode(area.bottomLeftVertex, {channel: "x", attribute: "date", shareScale: yEnc});
// // htEnc.scale.domain = [0,8000];
// htEnc.rangeExtent = 150;
scene.setLayoutParameters(areas, {vertCellAlignment: "middle"});

scene.axis("x", "date", {orientation: "bottom", pathY: 525, labelFormat: "%Y"});
scene.axis("height", "unemployments", {"orientation": "left", titleVisible: false});
scene.legend("fillColor", "industry", {x: 680, y: 100});