let scene = msc.scene();
let dt = await msc.csv("/datasets/csv/waffle.csv");

let rect = scene.mark("rect", {top:100, left: 200, width: 20, height: 20, fillColor: "blue", strokeWidth: 0, opacity: 0.8});
let c = msc.repeat(rect, dt);
c.layout = msc.layout("grid", {numCols: 10, rowGap: 2, colGap: 2});
msc.encode(rect, "fillColor", "Age Bin");
msc.update(rect, {"width": 30, "height": 30});
scene.legend("fillColor", "Age Bin", {x: 80, y: 120});

let trigger = { source: "my-spinner", event: "change" },
    responder = { object: c.layout, properties: ["numCols"] },
    fn = (evalResult, evtCtx, stateCtx, respObj) => {
        respObj.numCols = evtCtx.get("inputValue");
    };

let trigger2 = { source: "start-from", event: "change" },
    responder2 = { object: c.layout, properties: ["startCorner"] },
    fn2 = (evalResult, evtCtx, stateCtx, respObj) => {
        respObj.startCorner = evtCtx.get("inputValue");
    };

let trigger3 = { source: "dir", event: "change" },
    responder3 = { object: c.layout, properties: ["direction"] },
    fn3 = (evalResult, evtCtx, stateCtx, respObj) => {
        respObj.direction = evtCtx.get("inputValue");
    };

let tg1 = msc.activate(trigger, responder, undefined, fn);
let tg2 = msc.activate(trigger2, responder2, undefined, fn2);
let tg3 = msc.activate(trigger3, responder3, undefined, fn3);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scene);
