let scn = msc.scene();
let dt = await msc.csv("datasets/csv/gdp-lifeExp.csv");
let circle = scn.mark("circle", { radius: 6, x: 100, y: 80, strokeColor: "black", strokeWidth: 0 });
let collection = msc.repeat(circle, dt, { attribute: "Country" });

let xEncoding = msc.encode(circle, "x", "GDP per capita", {rangeExtent: 800});
let yEncoding = msc.encode(circle, "y", "Life expectancy");
let fillEncoding = msc.encode(circle, "fillColor", "Continent");

scn.axis("x", "GDP per capita", { orientation: "bottom", labelFormat: ".2s" });
scn.axis("y", "Life expectancy", { orientation: "left" });

scn.legend("fillColor", "Continent", { x: 700, y: 250 });
scn.gridlines("x", "GDP per capita");
scn.gridlines("y", "Life expectancy");

let arrow = scn.mark("arrow", { visibility: "hidden", strokeColor: "#90CAF9", strokeWidth: 2, endSize: 16 });

// 1. Click a circle to store it as the pinned country.
let pinTrigger = { event: "click", source: circle };
let pinResponder = { object: scn.state, properties: ["pinned"] };
let pinUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
    respObj.set("pinned", evtCtx.get("element"));
};

msc.activate(pinTrigger, pinResponder, undefined, pinUpdater);

// 2. When pinnedCountry changes, update circle appearances.
let pinnedTrigger = { event: "change", source: scn.state.var("pinned") };
let circleResponder = { object: circle, properties: ["strokeWidth"] };
let pinnedEvaluator = function (evtCtx, stateCtx, respObj) {
    return respObj === stateCtx.get("pinned");
};
let pinnedUpdater = function (evalResult, evtCtx, stateCtx, respObj) {
    if (evalResult) {
        respObj.strokeWidth = 3;
    }
};
msc.activate(pinnedTrigger, circleResponder, pinnedEvaluator, pinnedUpdater);

// 3. Hover another circle to show comparison guides.
let hoverTrigger = { event: "hover", source: circle };
let compareResponder = {
    object: [arrow],
    properties: ["visibility", "x", "y", "width", "height"]
};

let compareEvaluator = (evtCtx, stateCtx, respObj) => evtCtx.get("element") !== undefined && stateCtx.get("pinned") !== evtCtx.get("element");

let compareUpdater = function (evalResult, evtCtx, stateCtx, respObj) {
    let pinned = stateCtx.get("pinned"), hovered = evtCtx.get("element");
    if (pinned && evalResult) {
        arrow.x1 = pinned.bounds.x;
        arrow.y1 = pinned.bounds.y;
        arrow.x2 = hovered.bounds.x;
        arrow.y2 = hovered.bounds.y;
        arrow.visibility = "visible";
    } else {
        arrow.visibility = "hidden";
    }
};
msc.activate(hoverTrigger, compareResponder, compareEvaluator, compareUpdater);

// 4. show tooltip on differences in stats
let tooltip = scn.mark("richText", { visibility: "hidden", anchor: ["left", "top"], backgroundColor: "#fff"});
const formatter = new Intl.NumberFormat('en-US', { signDisplay: 'exceptZero' });
let tooltipResponder = { object: tooltip, properties: ["visibility", "x", "y", "text"] },
    tooltipEffect = function (evalResult, evtCtx, stateCtx, respObj) {
        if (evalResult && stateCtx.get("pinned")) {
            let pinned = stateCtx.get("pinned"), hovered = evtCtx.get("element");
            respObj.visibility = "visible";
            respObj.x = evtCtx.get("x") + 2;
            respObj.y = evtCtx.get("y") + 2;
            respObj.text = "Comparing <b>" + hovered.datum["Country"] + "</b> to <b>" + pinned.datum["Country"] + "</b>:<br>Life expectancy: " + formatter.format(hovered.datum["Life expectancy"] - pinned.datum["Life expectancy"]) + " years<br>GDP per capita: " + formatter.format(hovered.datum["GDP per capita"] - pinned.datum["GDP per capita"]);
        } else {
            respObj.visibility = "hidden";
        }
    };
msc.activate(hoverTrigger, tooltipResponder, compareEvaluator, tooltipEffect);


let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);
