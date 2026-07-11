let scene = msc.scene();
let csv = await msc.csv("/datasets/csv/car-weight.csv");
let binning = msc.transform("bin", {attribute: "weight(lbs)", numBins: 8});
let data = scene.derive(csv, binning);
let rect = scene.mark("rect", {top:100, left: 100, width: 40, height: 300, strokeColor: "#3a6186", strokeWidth: 0.5, fillColor: "#6baed6"});
let coll = msc.repeat(rect, data, {attribute: binning.binIdAttr});
msc.encode(rect, "height", msc.ROW_ID, {aggregator: "count", });
let xEnc = msc.encode(rect.leftSegment, "x", binning.startAttr, { rangeExtent: 400, aggregator: "min" });
msc.encode(rect.rightSegment, "x", binning.endAttr, { shareScale: xEnc, aggregator: "min" });

scene.axis("x", binning.startAttr, {orientation: "bottom", element: rect.leftSegment});
scene.axis("height", "rowId", {orientation: "left", titleVisible: false});

let trigger = { event: "input", source: "my-slider" },
    responder = { object: binning, properties: ["numBins"] },
    updater = (evalResult, evtCtx, stateCtx, respObj) => {
        binning.numBins = parseInt(evtCtx.get("inputValue"));
    };
msc.activate(trigger, responder, undefined, updater);

msc.renderer("svg", "svgElement").render(scene);
