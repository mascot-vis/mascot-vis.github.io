let scene = msc.scene();
let csv = await msc.csv("/datasets/csv/car-weight.csv");
//let data = csv.transform("bin", ["weight(lbs)"]);
//let binning = msc.transformation("binning");
let data = scene.transform("bin", csv, {attribute: "weight(lbs)", newAttribute: "weight_category"});
let rect = scene.mark("rect", {top:100, left: 200, width: 50, height: 200, strokeColor: "#222", strokeWidth: 0.5, fillColor: "#ddd"});
let coll = msc.repeat(rect, data, {attribute: "weight_category"});
coll.layout = msc.layout("grid", {numRows: 1, colGap:0});
//let enc = msc.encode(rect.leftSegment, {channel: "x", attribute: "x0"});
// msc.encode(rect.rightSegment, {channel: "x", attribute: "x1", scale: enc.scale});
// enc.scale.rangeExtent = 50 * data.getRowCount();
//msc.encode(rect, {channel: "height", attribute: "weight(lbs)_count"});
msc.encode(rect, {channel: "height", attribute: "rowId", aggregator: "count", rangeExtent: 350});

scene.axis("x", "weight_category", {orientation: "bottom"});
scene.axis("height", "rowId", {orientation: "left", titleVisible: false});