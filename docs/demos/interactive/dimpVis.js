let scene = msc.scene();
let dt = await msc.csv("/datasets/csv/gapminder.csv");

const years = dt.unique("year").sort((a, b) => a - b);
let yearFilter = msc.transform("filter", { attribute: "year", type: "interval", value: [years[0], years[0]] });
let yearData = scene.derive(dt, yearFilter);

// Year watermark
let yearText = scene.mark("text", { text: "1955", x: 520, y: 410, fillColor: "#aaa", opacity: 0.5, fontSize: 80, anchor: ["middle", "middle"]});

// Trail lines (all years)
let trailLine = scene.mark("line", {
    x1: 110, y1: 50, x2: 610, y2: 430, strokeColor: "#ddd",
    strokeWidth: 4.5, opacity: 0, vxShape: "circle", vxRadius: 5.5, vxFillColor: "#ccc", vxOpacity: 0
});
let trailColl = msc.repeat(trailLine, dt, { attribute: "country" });
let trailPoly = msc.densify(trailLine, dt, { attribute: "year" });

let trailXEnc = msc.encode(trailPoly.vertices[0], "x", "fertility", {includeZero: true});
let trailYEnc = msc.encode(trailPoly.vertices[0], "y", "life_expect");

// Scatter circles (current year only)
let circle = scene.mark("circle", { radius: 6, strokeWidth: 0.8, strokeColor: "white" });
let circleColl = msc.repeat(circle, yearData, { attribute: "country" });

// Circles share the trail scales for consistent x/y mapping.
msc.encode(circle, "x", "fertility",   { shareScale: trailXEnc });
msc.encode(circle, "y", "life_expect", { shareScale: trailYEnc });
let colorEnc = msc.encode(circle, "fillColor", "region");

scene.axis("x", "fertility",   { orientation: "bottom", title: "Fertility (births per woman)" });
scene.axis("y", "life_expect", { orientation: "left",   title: "Life expectancy (years)" });
scene.gridlines("x", "fertility");
scene.gridlines("y", "life_expect");
scene.legend("fillColor", "region", { x: 650, y: 35 });

// Label mark — on top of everything
let hoverLabel = scene.mark("text", {
    text: "", x: 200, y: 200, visibility: "hidden",
    fillColor: "#222", fontWeight: "bold",
    anchor: ["left", "middle"]
});

/** True if (x,y) is within `threshold` px of any vertex on country's trail. */
function isNearTrail(country, x, y, threshold) {
    let trail = trailColl.children.find(p => p.datum && p.datum["country"] === country);
    if (!trail) return false;
    let t2 = threshold * threshold;
    for (let v of trail.vertices) {
        let dx = v.x - x, dy = v.y - y;
        if (dx * dx + dy * dy < t2) return true;
    }
    return false;
}

let hoverTrigger = { source: circle, event: "hover" };
let dragTrigger = { source: circle, event: "drag" };

let trailVisibilityEval = (evtCtx, stateCtx, respObj) => {
    let elem    = evtCtx.get("element");
    let country = elem && elem.datum ? elem.datum["country"] : null;
    let dragElem = dragTrigger._dragElem;
    let dragged  = dragElem && dragElem.datum ? dragElem.datum["country"] : null;
    if (dragged) country = dragged;
    return country && respObj.datum["country"] === country;
};
let trailVisibilityUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
    respObj.opacity = evalResult ? 0.8 : 0;
    respObj.vxOpacity = evalResult ? 0.8 : 0;
};

msc.activate(hoverTrigger,
    { object: trailPoly, properties: ["opacity"] },
    trailVisibilityEval, trailVisibilityUpdater);

// Dim every other circle while one is hovered or dragged, to draw attention to it.
let otherCirclesEval = (evtCtx, stateCtx, respObj) => {
    let elem    = evtCtx.get("element");
    let country = elem && elem.datum ? elem.datum["country"] : null;
    let dragElem = dragTrigger._dragElem;
    let dragged  = dragElem && dragElem.datum ? dragElem.datum["country"] : null;
    if (dragged) country = dragged;
    return country && respObj.datum["country"] !== country;
};
let otherCirclesUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
    respObj.opacity = evalResult ? 0.5 : 1;
};
msc.activate(hoverTrigger,
    { object: circle, properties: ["opacity"] },
    otherCirclesEval, otherCirclesUpdater);

let labelHoverUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
    let elem    = evtCtx.get("element");
    let country = elem && elem.datum ? elem.datum["country"] : null;
    let x = evtCtx.get("x"), y = evtCtx.get("y");

    // Also show label during drag when near the trail
    if (!country) {
        let dragElem = dragTrigger._dragElem;
        let dragged  = dragElem && dragElem.datum ? dragElem.datum["country"] : null;
        if (dragged && isNearTrail(dragged, x, y, 80)) country = dragged;
    }

    if (country) {
        respObj.text       = country;
        respObj.x          = x + 10;
        respObj.y          = y - 10;
        respObj.visibility = "visible";
    } else {
        respObj.visibility = "hidden";
    }
};
msc.activate(hoverTrigger,
    { object: hoverLabel, properties: ["text", "x", "y", "visibility"] },
    undefined, labelHoverUpdater);

let dragYearUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
    let draggedCircle = evtCtx.get("element");
    let country = draggedCircle && draggedCircle.datum ? draggedCircle.datum["country"] : null;

    for (let t of trailColl.children) {
        let match = country && t.datum["country"] === country;
        t.opacity = match ? 0.8 : 0;
        t.vxOpacity = match ? 0.8 : 0;
    }
    for (let c of circleColl.children) {
        c.opacity = (country && c.datum["country"] !== country) ? 0.5 : 1;
    }

    if (!country) return; // drag ended: visuals reset above, nothing left to do

    let x = evtCtx.get("x"), y = evtCtx.get("y");
    let countryTrail = trailColl.children.find(
        p => p.datum && p.datum["country"] === country
    );
    if (!countryTrail) return;

    // Find the trail vertex closest to the drag cursor position
    let nearestYear = years[0], minDist = Infinity;
    for (let i = 0; i < Math.min(countryTrail.vertices.length, years.length); i++) {
        let vx = countryTrail.vertices[i].x, vy = countryTrail.vertices[i].y;
        let dist = (vx - x) * (vx - x) + (vy - y) * (vy - y);
        if (dist < minDist) { minDist = dist; nearestYear = years[i]; }
    }

    respObj.value = [nearestYear, nearestYear];
    yearText.text = String(new Date(nearestYear).getFullYear());
}

dragTrigger = msc.activate(dragTrigger, { object: yearFilter, properties: ["value"] }, undefined, dragYearUpdater);

msc.renderer("svg", "svgElement").render(scene);
