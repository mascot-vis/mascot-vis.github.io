let scn = msc.scene();
let dt = await msc.csv("datasets/csv/flights.csv");

let cfSpec = msc.transform("custom", (inTbl, outTbl, spec) => {
    let selectedSet = spec.selectedIds ? new Set(spec.selectedIds) : null;
    let binIdAttr = inTbl.attrs().find(a => a.endsWith("_bin_id"));

    let counts = {};
    for (let r of inTbl.rows()) {
        if (!selectedSet || selectedSet.has(r[msc.ROW_ID])) {
            let b = r[binIdAttr];
            counts[b] = (counts[b] || 0) + 1;
        }
    }
    outTbl.addAttr("_fg_count", "number", inTbl.rows().map(r => counts[r[binIdAttr]] || 0));
}, { selectedIds: null });

function makeHistogram(attr, numBins, left, top, barWidth) {
    let binSpec = msc.transform("bin", { attribute: attr, numBins: numBins });
    let binIdAttr = binSpec.binIdAttr;
    let bgData = scn.derive(dt, binSpec);
    let fgData = scn.derive(bgData, cfSpec);

    // Background bars (all flights, grey)
    let bgRect = scn.mark("rect", { left, top, width: barWidth, height: 160, fillColor: "#eee", strokeWidth: 0.5 });
    let bgColl = msc.repeat(bgRect, bgData, { attribute: binIdAttr });
    let bgHEnc = msc.encode(bgRect, "height", msc.ROW_ID, { aggregator: "count" });
    let bgXEnc = msc.encode(bgRect.leftSegment, "x", binSpec.startAttr, { rangeExtent: barWidth * binSpec.actualNumBins, aggregator: "min", sourceAttribute: attr });
    msc.encode(bgRect.rightSegment, "x", binSpec.endAttr, { shareScale: bgXEnc, aggregator: "min" });

    // Foreground bars (selected flights, steelblue) — shared height and x scales
    let fgRect = scn.mark("rect", { left, top, width: barWidth, height: 160, fillColor: "#6baed6", strokeColor: "#3a6186", strokeWidth: 0.5 });
    let fgColl = msc.repeat(fgRect, fgData, { attribute: binIdAttr });
    msc.encode(fgRect, "height", "_fg_count", { aggregator: "max", shareScale: bgHEnc });
    msc.encode(fgRect.leftSegment, "x", binSpec.startAttr, { shareScale: bgXEnc, aggregator: "min" });
    msc.encode(fgRect.rightSegment, "x", binSpec.endAttr, { shareScale: bgXEnc, aggregator: "min" });

    scn.axis("x", binSpec.startAttr, { orientation: "bottom", element: bgRect.leftSegment });
    scn.axis("height", msc.ROW_ID, { orientation: "left", element: bgRect, titleVisible: false });

    return { bgColl, binIdAttr };
}

let dist  = makeHistogram("distance", 20,  80,  80, 30);
let delay = makeHistogram("delay",    10,  60, 340, 20);
let time  = makeHistogram("time",     12, 360, 340, 22);

msc.activate(
    { source: [dist.bgColl, delay.bgColl, time.bgColl], event: "brushX" },
    { object: cfSpec, properties: ["selectedIds"] },
    undefined,
    (evalResult, evtCtx, stateCtx, respObj) => {
        let rows = evtCtx.get("selectedRows");
        respObj.selectedIds = rows && rows.length > 0 ? rows.map(r => r[msc.ROW_ID]) : null;
    }
);

msc.renderer("svg", "svgElement").render(scn);
