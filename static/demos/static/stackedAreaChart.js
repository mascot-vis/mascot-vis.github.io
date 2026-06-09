let scene = msc.scene();
let data = await msc.csv("/datasets/csv/unemployment-2.csv");
let rect = scene.mark("rect", {top:60, left: 100, width: 800, height: 450, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});

// // rect.divide first
// let industries = msc.divide(rect, {"partitionType":'divide', "orientation": "horizontal", "attribute": "industry", "datatable": data});
// let anyArea = msc.divide(industries.firstChild, {"partitionType":'BoundaryPartition', "orientation": "horizontal", "attribute": "date", "datatable": data});

// rect.densify first
let anyArea = msc.densify(rect, data, {orientation: "horizontal", attribute: "date"});
let {newMark:area, collection:areas} = msc.divide(anyArea, data, {orientation: "vertical", attribute: "industry"});
msc.update(areas.layout, {vertCellAlignment: "bottom"});

msc.encode(area, {channel: "fillColor", attribute: "industry", mapping: {"Manufacturing": "#7fc97f", "Leisure and hospitality": "#beaed4", "Business services": "#fdc086", "Construction": "#ffff99"}});
msc.encode(area, {channel: "height", attribute: "unemployments"});
let xEnc = msc.encode(area.topLeftVertex, {channel: "x", attribute: "date", rangeExtent: 700});
msc.encode(area.bottomLeftVertex, {channel: "x", attribute: "date", shareScale: xEnc});

scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y"});
scene.axis("height", "unemployments", {orientation: "left", titleOffset: 50});
scene.legend("fillColor", "industry", {x: 580, y: 100});

// disEncoding.scale.domain = [0, 8000];
// disEncoding.scale.rangeExtent = 450;