let scene = msc.scene();
let dt = await msc.csv("/datasets/csv/waffle.csv");

let rect = scene.mark("rect", {top:100, left: 200, width: 20, height: 20, fillColor: "blue", strokeWidth: 0, opacity: 0.8});
let c = msc.repeat(rect, dt);
c.layout = msc.layout("grid", {numCols: 10, rowGap: 2, colGap: 2});
msc.encode(rect, {"attribute": "Age Bin", channel: "fillColor"});
msc.update(rect, {"width": 30, "height": 30});
scene.legend("fillColor", "Age Bin", {x: 80, y: 120});

let trigger = { target: "my-spinner", event: "change" },
    responder = { component: c.layout, properties: ["numCols"] },
    fn = (condMet, ctx, compnt) => {
        compnt.numCols = ctx.get("inputValue");
    };

let trigger2 = { target: "start-from", event: "change" },
    responder2 = { component: c.layout, properties: ["startCorner"] },
    fn2 = (condMet, ctx, compnt) => {
        compnt.startCorner = ctx.get("inputValue");
    };

let trigger3 = { target: "dir", event: "change" },
    responder3 = { component: c.layout, properties: ["direction"] },
    fn3 = (condMet, ctx, compnt) => {
        compnt.direction = ctx.get("inputValue");
    };

let tg1 = msc.activate(trigger, responder, undefined, fn);
let tg2 = msc.activate(trigger2, responder2, undefined, fn2);
let tg3 = msc.activate(trigger3, responder3, undefined, fn3);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scene);