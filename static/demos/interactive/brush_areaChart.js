let scene = msc.scene();
let dt = await msc.csv("/datasets/csv/sp500.csv");

// Background area (full series)
let bgRect = scene.mark("rect", { top: 80, left: 80, width: 740, height: 320, fillColor: "cornflowerblue", strokeWidth: 0 });
let bgArea = msc.densify(bgRect, dt, { orientation: "horizontal", attribute: "date" });
let xEnc = msc.encode(bgArea.topLeftVertex, "x", "date");
msc.encode(bgArea.bottomLeftVertex, "x", "date", { shareScale: xEnc });
let hEnc = msc.encode(bgArea, "height", "price");
scene.axis("x", "date", { orientation: "bottom", element: bgArea.bottomLeftVertex, labelFormat: "%Y", titleVisible: false });
scene.axis("height", "price", { orientation: "left", element: bgArea });

// Overlay area within the brush range (hidden until the user draws a brush)
let overlayRect = scene.mark("rect", { top: 80, left: 80, width: 7, height: 320, fillColor: "tomato", strokeWidth: 0, opacity: 0 });
let filterSpec = msc.transform("filter", { attribute: "date", type: "interval" });
let overlayTbl = scene.derive(dt, filterSpec);
let overlayArea  = msc.densify(overlayRect, overlayTbl, { attribute: "date" });
msc.encode(overlayArea.topLeftVertex, "x", "date", { shareScale: xEnc });
msc.encode(overlayArea.bottomLeftVertex, "x", "date", { shareScale: xEnc });
msc.encode(overlayArea, "height", "price", { shareScale: hEnc });

let trigger = { source: bgArea, event: "brushX" },
    responder = { object: filterSpec, properties: ["value"] },
    updater = (evalResult, evtCtx, stateCtx, respObj) => {
        const xVals = evtCtx.get("xVals");
        overlayArea.opacity = xVals ? 1 : 0;
        respObj.value = xVals;
    };
msc.activate(trigger, responder, undefined, updater);

msc.renderer("svg", "svgElement").render(scene);
