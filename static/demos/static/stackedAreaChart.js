let scene = msc.scene();
let data = await msc.csv("/datasets/csv/unemployment-2.csv");
let rect = scene.mark("rect", {top:60, left: 100, width: 800, height: 450, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});

// // rect.divide first
// let industries = scene.divide(rect, {"partitionType":'divide', "orientation": "horizontal", "attribute": "industry", "datatable": data});
// let anyArea = scene.divide(industries.firstChild, {"partitionType":'BoundaryPartition', "orientation": "horizontal", "attribute": "date", "datatable": data});

// rect.densify first
let anyArea = scene.densify(rect, data, {orientation: "horizontal", attribute: "date"});
let {newMark:area, collection:areas} = scene.divide(anyArea, data, {orientation: "vertical", attribute: "industry"});
scene.setLayoutParameters(areas, {vertCellAlignment: "bottom"});

scene.encode(area, {channel: "fillColor", attribute: "industry", mapping: {"Manufacturing": "#7fc97f", "Leisure and hospitality": "#beaed4", "Business services": "#fdc086", "Construction": "#ffff99"}});
scene.encode(area, {channel: "height", attribute: "unemployments"});
let xEnc = scene.encode(area.topLeftVertex, {channel: "x", attribute: "date", rangeExtent: 700});
scene.encode(area.bottomLeftVertex, {channel: "x", attribute: "date", shareScale: xEnc});

scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y"});
scene.axis("height", "unemployments", {orientation: "left", titleOffset: 50});
scene.legend("fillColor", "industry", {x: 580, y: 100});

// disEncoding.scale.domain = [0, 8000];
// disEncoding.scale.rangeExtent = 450;