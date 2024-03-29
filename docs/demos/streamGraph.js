let scene = msc.scene();
let data = await msc.csv("datasets/csv/unemployment-2.csv");
let rect = scene.mark("rect", {top:60, left: 100, width: 560, height: 450, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});

// // rect.divide first
// let industries = scene.divide(rect, {"partitionType":'divide', "orientation": "horizontal", "field": "industry", "datatable": data});
// let anyArea = scene.divide(industries.firstChild, {"partitionType":'BoundaryPartition', "orientation": "horizontal", "field": "date", "datatable": data});

// rect.densify first
let anyArea = scene.densify(rect, data, {orientation: "horizontal", field: "date"});
let areas = scene.divide(anyArea, data, {orientation: "vertical", field: "industry"});
scene.setProperties(areas.layout, {vertCellAlignment: "middle"});

scene.encode(areas.firstChild, {channel: "fillColor", field: "industry"});
let disEncoding = scene.encode(areas.firstChild, {channel: "height", field: "unemployments"});
scene.encode(areas.firstChild.firstVertexPair, {channel: "x", field: "date"});
disEncoding.scale.domain = [0,8000];
disEncoding.scale.rangeExtent = 450;
scene.axis("x", "date", {orientation: "bottom", pathY: 525, labelFormat: "%m/%y"});
scene.axis("height", "unemployments", {"orientation": "left"});
scene.legend("fillColor", "industry", {x: 680, y: 100});