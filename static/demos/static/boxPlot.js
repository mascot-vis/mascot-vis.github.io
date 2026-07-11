let scn = msc.scene();

let line = scn.mark("line", {x1: 150, y1: 130, x2: 700, y2: 130, strokeColor: "#555", vxShape: "rect", vxWidth: 1, vxHeight: 30, vxFillColor: "#555"}),
    box = scn.mark("rect", {top: 110, left: 200, width: 400, height: 40, fillColor: "#95D0F5", strokeColor: "#111"}),
    medianLine = scn.mark("line", {x1: 300, y1: 110, x2: 300, y2: 150, strokeColor: "#000"});

let glyph = scn.glyph(line, box, medianLine);

let dt = await msc.csv("/datasets/csv/monthlySales.csv");
msc.attach(glyph, dt);
let enc = msc.encode(line.vertices[0], "x", "Sales", {aggregator: "min"});
msc.encode(line.vertices[1], "x", "Sales", {shareScale: enc, aggregator: "max"});
msc.encode(box.leftSegment, "x", "Sales", {shareScale: enc, aggregator: "percentile 25"});
msc.encode(box.rightSegment, "x", "Sales", {shareScale: enc, aggregator: "percentile 75"});
msc.encode(medianLine, "x", "Sales", {shareScale: enc, aggregator: "median"});
enc.rangeExtent = 600;
scn.axis("x", "Sales", {orientation: "bottom", pathY: 160, labelFormat: ".2s"});

let circ = scn.mark("circle", {strokeColor: "#32A457", fillColor: "none", strokeWidth: 4, radius: 6,  y: 130, opacity: 0.75});
msc.repeat(circ, dt);
msc.encode(circ, "x", "Sales", {shareScale: enc});