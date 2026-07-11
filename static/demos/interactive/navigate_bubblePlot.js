let scn = msc.scene({fillColor: "#333"});
let dt = await msc.csv("/datasets/csv/planets.csv");
let circle = scn.mark("circle", {radius: 6, x: 200, y: 60, fillColor: "orange", strokeWidth: 1, strokeColor: "white", opacity: 0.3});

let collection = msc.repeat(circle, dt, { attribute: "name" });

let xEncoding = msc.encode(circle, "x", "hzd", {rangeExtent: 500});
let yEncoding = msc.encode(circle, "y", "mass", {flipScale: true, rangeExtent: 500});
let sizeEnc = msc.encode(circle, "radius", "radius", {rangeExtent: 40});
let fillEncoding = msc.encode(circle, "fillColor", "hzd", {scheme: "interpolateRdYlBu"});

scn.axis("x", "hzd", { orientation: "bottom", strokeColor: "#ccc", textColor: "#ccc" });
scn.axis("y", "mass", { orientation: "left", strokeColor: "#ccc", textColor: "#ccc" });
// scn.gridlines("x", "hzd", { strokeColor: "#555" });
// scn.gridlines("y", "mass", { strokeColor: "#555" });
scn.legend("fillColor", "hzd", {x: 750, y: 100, textColor: "#eee"});

scn.mask(collection);
let trigger = { source: "background", event: "zoom" },
    responder = { object: [xEncoding, yEncoding], properties: ["domain"] },
    updater = (evalResult, evtCtx, stateCtx, respObj) => {
        let dy = evtCtx.get("deltaY"), dir = dy > 0 ? 1 : dy < 0 ? -1 : 0;
        for (let c of respObj) {
            c.zoom(dir, c.channel === "x" ? evtCtx.get("x") : evtCtx.get("y"), 0.1);
        }
    };
let tg1 = msc.activate(trigger, responder, undefined, updater);

let trigger2 = { source: "background", event: "drag" },
    responder2 = { object: [xEncoding, yEncoding], properties: ["domain"] },
    updater2 = (evalResult, evtCtx, stateCtx, respObj) => {
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
let tg2 = msc.activate(trigger2, responder2, undefined, updater2);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);
