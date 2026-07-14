let scene = msc.scene();
let csv = await msc.csv("/datasets/csv/car-weight.csv");
let binSpec = msc.transform("bin", {attribute: "weight(lbs)"});
let data = scene.derive(csv, binSpec);
let binIdAttr = binSpec.binIdAttr;
let rect = scene.mark("rect", {top:100, left: 200, width: 50, height: 350, strokeColor: "#222", strokeWidth: 0.5, fillColor: "#ddd"});
let coll = msc.repeat(rect, data, {attribute: binIdAttr});
msc.encode(rect, "height", msc.ROW_ID, {aggregator: "count"});
let xEnc = msc.encode(rect.leftSegment, "x", binSpec.startAttr, { rangeExtent: 50 * binSpec.actualNumBins, aggregator: "min", sourceAttribute: binSpec.attribute });
msc.encode(rect.rightSegment, "x", binSpec.endAttr, { shareScale: xEnc, aggregator: "min" });

scene.axis("x", binSpec.startAttr, {orientation: "bottom", element: rect.leftSegment});
scene.axis("height", "rowId", {orientation: "left", titleVisible: false});
