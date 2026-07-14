let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/splom_200.csv");
let attributes = ["d0", "d1", "d2", "d3"];
//let attributes = ["d0", "d1"];
let scatterplots = scn.composite();
let fillEnc;

for (let row of attributes) {
    for (let col of attributes.slice().reverse()) {
        let circle = scn.mark("circle", {
            radius: 3, x: 40, y: 30, fillColor: "orange",
            strokeWidth: 0
        });
        let sp = msc.repeat(circle, dt);
        msc.encode(circle, "x", row, {rangeExtent: 105});
        msc.encode(circle, "y", col, {rangeExtent: 105});
        if (fillEnc)
            msc.encode(circle, "fillColor", "c", {shareScale: fillEnc});
        else
            fillEnc = msc.encode(circle, "fillColor", "c");
        scn.axis("x", row, { element: circle, titleVisible: false });
        scn.axis("y", col, { element: circle, titleVisible: false });
        scn.gridlines("x", row, { element: circle });
        scn.gridlines("y", col, { element: circle });
        scatterplots.addChild(sp);
    }
}

scn.setLayout(scatterplots, msc.layout("grid", { numCols: 4, colGap: 30, rowGap: 30 }));

let colls = scatterplots.children,
    circles = colls.map(c => c.children[0]);

let trigger = { event: "brush", source: colls },
    responder = { object: circles, properties: ["fillColor"] },
    evalFn = (evtCtx, stateCtx, respObj) => {
        let int1 = evtCtx.get("xVals"),
            int2 = evtCtx.get("yVals"),
            attr1 = evtCtx.get("xAttr"),
            attr2 = evtCtx.get("yAttr");
        if (!attr1 || !attr2 || !int1 || !int2) return true;
        const attrVal1 = respObj.datum[attr1],
            attrVal2 = respObj.datum[attr2];
        return (attrVal1 >= int1[0] && attrVal1 <= int1[1] && attrVal2 >= int2[0] && attrVal2 <= int2[1]);
    },
    highlighter = (evalResult, evtCtx, stateCtx, respObj) => {
        if (!evalResult) {
            respObj.fillColor = '#eee';
        }
    };
msc.activate(trigger, responder, evalFn, highlighter);



msc.renderer('svg', 'svgElement').render(scn);
