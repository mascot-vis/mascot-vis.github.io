let scene = msc.scene();
let data = await msc.csv("/datasets/csv/sp500.csv");
let rect1 = scene.mark("rect", {top:60, left: 100, width: 800, height: 350, strokeWidth: 0, fillColor: "steelblue"}),
    rect2 = scene.mark("rect", {top:460, left: 100, width: 800, height: 80, strokeWidth: 0, fillColor: "steelblue"});

let detail = msc.densify(rect1, data, {orientation: "horizontal", attribute: "date"}),
    overview = msc.densify(rect2, data, {orientation: "horizontal", attribute: "date"});

let detailEnc = msc.encode(detail.topLeftVertex, "x", "date");
msc.encode(detail.bottomLeftVertex, "x", "date", {shareScale: detailEnc});
msc.encode(detail, "height", "price");
scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y", element: detail.bottomLeftVertex, titleVisible: false});
scene.axis("height", "price", {orientation: "left", element: detail, titleVisible: false});
let detailEncDomain = detailEnc.domain.slice();

let overviewEnc = msc.encode(overview.topLeftVertex, "x", "date");
msc.encode(overview.bottomLeftVertex, "x", "date", {shareScale: overviewEnc});
msc.encode(overview, "height", "price");
scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y", element: overview.bottomLeftVertex, titleVisible: false});

scene.mask(detail);

let trigger = { event: "brushX", source: overview },
    responder = { object: detailEnc, properties: ["domain"] };
let updater = (evalResult, evtCtx, stateCtx, respObj) => {
    if (evtCtx.get("xCoords")) {
        let domain = evtCtx.get("xCoords").map(d => new Date(overviewEnc.getAttrValue(d, overview.topLeftVertex)));
        respObj.domain = domain;
    } else
        respObj.domain = detailEncDomain;
}
let tg = msc.activate(trigger, responder, undefined, updater);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scene);
