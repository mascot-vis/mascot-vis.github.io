let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/iris.csv");

let valueAttrs = ["sepal length", "sepal width", "petal length", "petal width"];

let longTable = scn.derive(dt, msc.transform("unpivot", { valueVars: valueAttrs, varName: "attrs" }));

let positions = {
    "sepal length": { x: 190, y: 130 },
    "sepal width":  { x: 610, y: 130 },
    "petal length": { x: 190, y: 450 },
    "petal width":  { x: 610, y: 450 }
};

let icon = scn.mark("text", { x: 20, y: 0, text: "🧲", anchor: ["center", "middle"], fontSize: "30px", cursor: "grab" });
let label = scn.mark("text", { x: 20, y: 26, text: "attr", anchor: ["center", "top"], fontWeight: "bold", fontSize: "13px", fillColor: "#333", cursor: "grab" });
let magnet = scn.glyph(icon, label);
let magnets = msc.repeat(magnet, longTable, { attribute: "attrs" });
msc.encode(label, "text", "attrs");

magnets.children.forEach((g) => {
    let p = positions[g.datum.attrs];
    g.x = p.x;
    g.y = p.y;
});

const MAGNET_EXCLUSION_RADIUS = 55;

// The function CustomLayout calls once per recompute for the WHOLE dust cloud
// (not once per dust point), every time layout.params changes. `layout` here
// is the CustomLayout instance itself, so layout.params.magnetPositions
// always reflects the magnets' latest (possibly just-dragged) positions.
// `ranges` lives in the same params object -- it's only ever read here, so
// there's no reason for it to be a separate outer variable. Destructuring
// `layout.params` once up front (rather than once per point) is the whole
// point of the bulk signature: it turns N per-child calls into this single
// call. Targets are returned keyed by child.id (not by array position), so
// CustomPlacer still pairs each point with its own target correctly even if
// `children`'s order ever changes between recomputes.
function computeDustPositions(children, layout) {
    let { magnetPositions: mp, ranges } = layout.params;
    let targets = {};

    for (let child of children) {
        let datum = child.datum;
        let weights = valueAttrs.map((attr) => {
            let r = ranges[attr];
            return r.max > r.min ? (datum[attr] - r.min) / (r.max - r.min) : 0.5;
        });
        let total = weights.reduce((a, b) => a + b, 0);
        let cx, cy;
        if (total < 1e-6) {
            cx = valueAttrs.reduce((s, attr) => s + mp[attr].x, 0) / valueAttrs.length;
            cy = valueAttrs.reduce((s, attr) => s + mp[attr].y, 0) / valueAttrs.length;
        } else {
            cx = weights.reduce((s, w, i) => s + w * mp[valueAttrs[i]].x, 0) / total;
            cy = weights.reduce((s, w, i) => s + w * mp[valueAttrs[i]].y, 0) / total;
        }
        let angle = Math.random() * 2 * Math.PI,
            r = Math.random() * 2;
        let j = { dx: Math.cos(angle) * r, dy: Math.sin(angle) * r };
        let x = cx + j.dx, y = cy + j.dy;

        for (let attr of valueAttrs) {
            let m = mp[attr],
                ddx = x - m.x, ddy = y - m.y,
                dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < MAGNET_EXCLUSION_RADIUS) {
                let angle = dist > 1e-6 ? Math.atan2(ddy, ddx) : Math.atan2(j.dy, j.dx);
                x = m.x + Math.cos(angle) * MAGNET_EXCLUSION_RADIUS;
                y = m.y + Math.sin(angle) * MAGNET_EXCLUSION_RADIUS;
            }
        }

        targets[child.id] = { x, y };
    }

    return targets;
}

let dustLayout = msc.layout("custom", {
    compute: computeDustPositions,
    params: {
        magnetPositions: positions,
        ranges: valueAttrs.reduce((acc, attr) => {
            let s = dt.summary(attr);
            acc[attr] = { min: s.min, max: s.max };
            return acc;
        }, {})
    }
});

let dust = scn.mark("circle", {
    radius: 6, x: 500, y: 345,
    fillColor: "#999", strokeColor: "#fff", strokeWidth: 0.5, opacity: 0.85
});
let dustCollection = msc.repeat(dust, dt, { attribute: "id" });
msc.encode(dust, "fillColor", "species");
scn.legend("fillColor", "species", { x: 470, y: 30, orientation: "horizontal" });
dustCollection.layout = dustLayout;

let dragTrigger = { event: "drag", source: magnet };
let moveMagnetUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
    respObj.x += evtCtx.get("dx");
    respObj.y += evtCtx.get("dy");
};
msc.activate(dragTrigger, { object: msc.TRIGGER_ELEMENT, properties: ["x", "y"] }, undefined, moveMagnetUpdater);

// Re-pull the dust cloud toward whichever magnet just moved. dustLayout is a
// single shared object (it's not repeated), so its target is fixed -- but we
// still need to know WHICH magnet's position to update inside it. We recover
// that the same way msc.TRIGGER_ELEMENT does internally: evtCtx's "element"
// is whatever leaf mark (the icon or label text) the pointer actually hit, so
// walk up to the nearest ancestor that is itself a direct child of the
// repeated collection -- the magnet glyph clone itself -- then read its
// "attrs" datum to know which measurement it represents.
let dustUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
    let elem = evtCtx.get("element");
    while (elem && elem.parent && elem.parent.type !== "collection") elem = elem.parent;
    if (!elem) return;
    let attr = elem.datum.attrs,
        mp = respObj.params.magnetPositions,
        dx = evtCtx.get("dx"), dy = evtCtx.get("dy");
    mp[attr] = { x: mp[attr].x + dx, y: mp[attr].y + dy };
    respObj.params = { ...respObj.params, magnetPositions: mp };
};
msc.activate(dragTrigger, { object: dustLayout, properties: ["params"] }, undefined, dustUpdater);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);
