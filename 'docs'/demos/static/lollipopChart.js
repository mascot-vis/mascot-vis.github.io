let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/borough_damage.csv");

let line = scn.mark("line", {x1: 200, y1: 100, x2: 500, y2: 100, strokeColor: "#aaa"});
scn.setProperties(line.vertices[1], {shape: "circle", radius: 4.5});

let c = scn.repeat(line, dt, {attribute: "Borough"});
c.layout = msc.layout("grid", {numCols: 1, rowGap: 15});

// let c2 = scn.repeat(c, dt, {attribute: "Borough"});
// c2.layout = msc.layout("grid", {numCols: 1, rowGap: 30});

let enc = scn.encode(line.vertices[1], {attribute: "Crime Rate", channel: "x", rangeExtent: 400});
scn.encode(line.vertices[1], {attribute: "Area", channel: "fillColor"});

scn.axis("x", "Crime Rate", {orientation: "bottom"});
scn.axis("y", "Borough", {orientation: "left", pathVisible: false, tickVisible: false, titleVisible: false});
//scn.axis("y", "Area", {orientation: "left", pathVisible: false, tickVisible: false, pathX: 160});

scn.gridlines("x", "Crime Rate", {strokeColor: "#eee"});

scn.legend("fillColor", "Area", {"x": 600, "y": 100});