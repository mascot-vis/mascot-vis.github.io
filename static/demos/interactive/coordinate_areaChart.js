let scene = msc.scene();
let data = await msc.csv("/datasets/csv/sp500.csv");
let rect1 = scene.mark("rect", {top:60, left: 100, width: 800, height: 350, strokeWidth: 0, fillColor: "steelblue"}),
    rect2 = scene.mark("rect", {top:460, left: 100, width: 800, height: 80, strokeWidth: 0, fillColor: "steelblue"});

let detail = msc.densify(rect1, data, {orientation: "horizontal", attribute: "date"}),
    overview = msc.densify(rect2, data, {orientation: "horizontal", attribute: "date"});

let detailEnc = msc.encode(detail.topLeftVertex, {channel: "x", attribute: "date"});
msc.encode(detail.bottomLeftVertex, {channel: "x", attribute: "date", shareScale: detailEnc});
msc.encode(detail, {channel: "height", attribute: "price"});
scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y", element: detail.bottomLeftVertex, titleVisible: false});
scene.axis("height", "price", {orientation: "left", element: detail, titleVisible: false});
let detailEncDomain = detailEnc.domain.slice();

let overviewEnc = msc.encode(overview.topLeftVertex, {channel: "x", attribute: "date"});
msc.encode(overview.bottomLeftVertex, {channel: "x", attribute: "date", shareScale: overviewEnc});
msc.encode(overview, {channel: "height", attribute: "price"});
scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y", element: overview.bottomLeftVertex, titleVisible: false});

scene.mask(detail);

let trigger = { event: "brushX", target: overview },
    responder = { component: detailEnc, properties: ["domain"] };
let updater = (condMet, ctx, compnt) => {
    if (ctx.get("xInterval")) {
        let domain = ctx.get("xInterval").map(d => new Date(overviewEnc.getAttrValue(d, overview.topLeftVertex)));
        compnt.domain = domain;
    } else
        compnt.domain = detailEncDomain;
}
let tg = msc.activate(trigger, responder, undefined, updater);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scene);