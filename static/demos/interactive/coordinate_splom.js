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
        msc.encode(circle, { attribute: row, channel: "x", rangeExtent: 105 });
        msc.encode(circle, { attribute: col, channel: "y", rangeExtent: 105 });
        if (fillEnc)
            msc.encode(circle, { attribute: "c", channel: "fillColor", shareScale: fillEnc });
        else
            fillEnc = msc.encode(circle, { attribute: "c", channel: "fillColor" });
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

let trigger = { event: "brush", target: colls },
    responder = { component: circles, channels: ["fillColor"] },
    evalFn = (ctx, compnt) => {
        let int1 = ctx.get("xAttrValues"),
            int2 = ctx.get("yAttrValues"),
            attr1 = ctx.get("xAttribute"),
            attr2 = ctx.get("yAttribute");
        if (!attr1 || !attr2 || !int1 || !int2) return true;
        const attrVal1 = compnt.dataScope.getAttrVal(attr1),
            attrVal2 = compnt.dataScope.getAttrVal(attr2);
        //const attrVal1 = 1, attrVal2 = 1; //dummy values to avoid repeated dataScope access`,

        return (attrVal1 >= int1[0] && attrVal1 <= int1[1] && attrVal2 >= int2[0] && attrVal2 <= int2[1]);
    },
    // evalFn = (ctx, peers) => {
    //     let result = {};
    //     for (let compnt of peers) {
    //         let int1 = ctx.get("xAttrValues"),
    //             int2 = ctx.get("yAttrValues"),
    //             attr1 = ctx.get("xAttribute"),
    //             attr2 = ctx.get("yAttribute");
    //         if (!attr1 || !attr2 || !int1 || !int2) {
    //             result[compnt.id] = true;
    //             continue;
    //         }
    //         const attrVal1 = compnt.dataScope.getAttrVal(attr1),
    //             attrVal2 = compnt.dataScope.getAttrVal(attr2);
    //         result[compnt.id] = (attrVal1 >= int1[0] && attrVal1 <= int1[1] && attrVal2 >= int2[0] && attrVal2 <= int2[1]);
    //     }
    //     return result;
    // },
    highlighter = (condMet, ctx, compnt) => {
        if (!condMet) {
            compnt.fillColor = '#eee';
        }
    };
msc.activate(trigger, responder, evalFn, highlighter);



msc.renderer('svg', 'svgElement').render(scn);