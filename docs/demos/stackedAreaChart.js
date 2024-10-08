let scene = msc.scene();
let data = await msc.csv("datasets/csv/unemployment-2.csv");
let rect = scene.mark("rect", {top:60, left: 100, width: 800, height: 450, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});

// // rect.divide first
// let industries = scene.divide(rect, {"partitionType":'divide', "orientation": "horizontal", "field": "industry", "datatable": data});
// let anyArea = scene.divide(industries.firstChild, {"partitionType":'BoundaryPartition', "orientation": "horizontal", "field": "date", "datatable": data});

// rect.densify first
let anyArea = scene.densify(rect, data, {orientation: "horizontal", field: "date"});
let areas = scene.divide(anyArea, data, {orientation: "vertical", field: "industry"});
scene.setProperties(areas.layout, {vertCellAlignment: "bottom"});

scene.encode(areas.firstChild, {channel: "fillColor", field: "industry", mapping: {"Manufacturing": "#7fc97f", "Leisure and hospitality": "#beaed4", "Business services": "#fdc086", "Construction": "#ffff99"}});
scene.encode(areas.firstChild, {channel: "height", field: "unemployments"});
scene.encode(areas.firstChild.firstVertexPair, {channel: "x", field: "date", rangeExtent: 700});
// disEncoding.scale.domain = [0, 8000];
// disEncoding.scale.rangeExtent = 450;
scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y"});
scene.axis("height", "unemployments", {orientation: "left", titleOffset: 50});
scene.legend("fillColor", "industry", {x: 580, y: 100});