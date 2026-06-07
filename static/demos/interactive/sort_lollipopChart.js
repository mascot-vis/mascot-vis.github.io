let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/borough_damage.csv");

let line = scn.mark("line", {x1: 200, y1: 100, x2: 500, y2: 100, strokeColor: "#aaa"});
msc.update(line.vertices[1], {shape: "circle", radius: 4.5});

let c = msc.repeat(line, dt, {attribute: "Borough"});
msc.sortChildren(c, "Borough");
c.layout = msc.layout("grid", {numCols: 1, rowGap: 15});

// let c2 = msc.repeat(c, dt, {attribute: "Borough"});
// c2.layout = msc.layout("grid", {numCols: 1, rowGap: 30});

let enc = msc.encode(line.vertices[1], {attribute: "Crime Rate", channel: "x", rangeExtent: 400});
msc.encode(line.vertices[1], {attribute: "Area", channel: "fillColor"});

scn.axis("x", "Crime Rate", {orientation: "bottom"});
scn.axis("y", "Borough", {orientation: "left", pathVisible: false, tickVisible: false, titleVisible: false});
scn.axis("y", "Area", {orientation: "left", pathVisible: false, tickVisible: false, pathX: 160});

scn.gridlines("x", "Crime Rate", {strokeColor: "#eee"});

scn.legend("fillColor", "Area", {"x": 650, "y": 100});

let trigger = { target: "attr", event: "change" },
    responder = { component: c, properties: ["order"] },
    fn = (condMet, ctx, compnt) => {
        msc.sortChildren(compnt, ctx.get("inputValue"), compnt.sortBy.descending);
    };
let tg1 = msc.activate(trigger, responder, undefined, fn);

let trigger2 = { target: "dir", event: "change" },
    fn2 = (condMet, ctx, compnt) => {
        msc.sortChildren(compnt, compnt.sortBy.property, ctx.get("inputValue") === "descending" ? true : false);
    };
let tg2 = msc.activate(trigger2, responder, undefined, fn2);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);