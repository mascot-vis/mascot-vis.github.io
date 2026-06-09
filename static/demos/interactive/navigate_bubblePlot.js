let scn = msc.scene({fillColor: "#333"});
let dt = await msc.csv("/datasets/csv/planets.csv");
let circle = scn.mark("circle", {radius: 6, x: 200, y: 60, fillColor: "orange", strokeWidth: 1, strokeColor: "white", opacity: 0.3});

let collection = msc.repeat(circle, dt, { attribute: "name" });

let xEncoding = msc.encode(circle, { attribute: "hzd", channel: "x", rangeExtent: 500 });
let yEncoding = msc.encode(circle, { attribute: "mass", channel: "y", flipScale: true, rangeExtent: 500 });
let sizeEnc = msc.encode(circle, { attribute: "radius", channel: "radius", rangeExtent: 40 });
let fillEncoding = msc.encode(circle, { attribute: "hzd", channel: "fillColor", scheme: "interpolateRdYlBu" });

scn.axis("x", "hzd", { orientation: "bottom", strokeColor: "#ccc", textColor: "#ccc" });
scn.axis("y", "mass", { orientation: "left", strokeColor: "#ccc", textColor: "#ccc" });
// scn.gridlines("x", "hzd", { strokeColor: "#555" });
// scn.gridlines("y", "mass", { strokeColor: "#555" });
scn.legend("fillColor", "hzd", {x: 750, y: 100, textColor: "#eee"});

scn.mask(collection);
let trigger = { target: "background", event: "zoom" },
    responder = { component: [xEncoding, yEncoding], properties: ["domain"] },
    updater = (condMet, ctx, compnt) => {
        let dy = ctx.get("deltaY"), dir = dy > 0 ? 1 : dy < 0 ? -1 : 0;
        for (let c of compnt) {
            c.zoom(dir, c.channel === "x" ? ctx.get("x") : ctx.get("y"), 0.1);
        }
    };
let tg1 = msc.activate(trigger, responder, undefined, updater);

let trigger2 = { target: "background", event: "drag" },
    responder2 = { component: [xEncoding, yEncoding], properties: ["domain"] },
    updater2 = (condMet, ctx, compnt) => {
        let dx = ctx.get("dx"), dy = ctx.get("dy"),
            x = ctx.get("x"), y = ctx.get("y");
        for (let c of compnt) {
            c.pan(c.channel === "x" ? x : y, c.channel === "x" ? dx : dy);
        }
    };
let tg2 = msc.activate(trigger2, responder2, undefined, updater2);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);