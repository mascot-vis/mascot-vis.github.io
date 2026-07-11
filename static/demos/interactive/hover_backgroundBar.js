let scene = msc.scene();
let csv = await msc.csv("/datasets/csv/car-weight.csv");
let binSpec = msc.transform("bin", {attribute: "weight(lbs)"});
let data = scene.derive(csv, binSpec);
let bgBar = scene.mark("rect", {top:100, left: 200, width: 50, height: 350, fillColor: "#eee", opacity: 0}),
    rect = scene.mark("rect", {top:100, left: 200, width: 50, height: 350, strokeColor: "#222", strokeWidth: 0.5, fillColor: "#28ebbd"});
let glyph = scene.glyph(bgBar, rect);
let coll = msc.repeat(glyph, data, {attribute: binSpec.binIdAttr});
msc.encode(rect, "height", msc.ROW_ID, {aggregator: "count", domain: [0, 120]});
let xEnc = msc.encode(bgBar.leftSegment, "x", binSpec.startAttr, { rangeExtent: 350, aggregator: "min", sourceAttribute: binSpec.attribute });
msc.encode(bgBar.rightSegment, "x", binSpec.endAttr, { shareScale: xEnc, aggregator: "min" });
msc.encode(rect.leftSegment, "x", binSpec.startAttr, { shareScale: xEnc, aggregator: "min" });
msc.encode(rect.rightSegment, "x", binSpec.endAttr, { shareScale: xEnc, aggregator: "min" });

scene.axis("x", binSpec.startAttr, {orientation: "bottom", pathVisible: false, element: bgBar.leftSegment});
scene.axis("height", msc.ROW_ID, {orientation: "left", titleVisible: false});
scene.gridlines("height", msc.ROW_ID);

let trigger = { source: "background", event: "hover" },
    responder = { object: bgBar, properties: ["opacity"] },
    evaluator = (evtCtx, stateCtx, respObj) => {
        let xVal = evtCtx.get("xVal");
        return xVal !== undefined && respObj.datum[binSpec.startAttr] <= xVal && xVal < respObj.datum[binSpec.endAttr];
    },
    updater = (evalResult, evtCtx, stateCtx, respObj) => {
        respObj.opacity = evalResult ? 0.5 : 0;
    };
msc.activate(trigger, responder, evaluator, updater);

msc.renderer("svg", "svgElement").render(scene);
