let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/splom_200.csv");
//let attributes = ["d0", "d1", "d2", "d3"];
let attributes = ["d0", "d1"];
let scatterplots = scn.composite(), xEncs = [], yEncs = [];

for (let row of attributes) {
    for (let col of attributes.slice().reverse()) {
        let circle = scn.mark("circle", {
            radius: 4, x: 80, y: 30,
            strokeWidth: 2, strokeColor: "coral"
        });
        let sp = msc.repeat(circle, dt);
        let xEnc = msc.encode(circle, "x", row, {rangeExtent: 205});
        let yEnc = msc.encode(circle, "y", col, {rangeExtent: 205});
        xEncs.push(xEnc);
        yEncs.push(yEnc);
        scn.axis("x", row, { element: circle});
        scn.axis("y", col, { element: circle});
        scn.gridlines("x", row, { element: circle });
        scn.gridlines("y", col, { element: circle });
        scatterplots.addChild(sp);
    }
}

scn.setLayout(scatterplots, msc.layout("grid", { numCols: 2, colGap: 80, rowGap: 80 }));

let colls = scatterplots.children,
    circles = colls.map(c => c.children[0]);
colls.forEach(sp => scn.mask(sp));


let trigger = { event: "drag", source: "background" },
    responder = { object: [...xEncs, ...yEncs], properties: ["domain"] },
    updater = (evalResult, evtCtx, stateCtx, respObj) => {
        let xAttr  = evtCtx.get("xAttr"), yAttr  = evtCtx.get("yAttr"),
            dxData = evtCtx.get("dxData"), dyData = evtCtx.get("dyData");

        if (!xAttr && !yAttr) return;
        const deltas = { [xAttr]: dxData, [yAttr]: dyData };

        for (let enc of respObj) {
            let dv = deltas[enc.attribute];
            if (dv == null) continue;
            enc.domain = enc.getDomain(enc.element).map(v => v + dv);
        }
    };
msc.activate(trigger, responder, undefined, updater);



msc.renderer('svg', 'svgElement').render(scn);
