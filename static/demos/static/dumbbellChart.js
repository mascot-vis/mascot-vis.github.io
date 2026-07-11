let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/orlandoShooting.csv");

let line = scn.mark("line", {x1: 430, y1: 100, x2: 500, y2: 100, strokeWidth: 8}),
    topic = scn.mark("text", {x: 100, y: 100, anchor: ["left", "middle"], fontWeight: "bold", "text": "topic"}),
    rep = scn.mark("text", {x: 330, y: 100, anchor: ["left", "middle"], fillColor: "#a20e19", fontWeight: "bold", "text": "rep"}),
    dem = scn.mark("text", {x: 370, y: 100, anchor: ["left", "middle"], fillColor: "#185a97", fontWeight: "bold", "text": "dem"});


let coll = msc.repeat(line, dt, {attribute: "Topic", layout: msc.layout("grid", {numCols: 1, rowGap: 45})});
msc.classify(coll, {attribute: "Comparison", layout: msc.layout("grid", {numCols: 1, rowGap: 16})});

let textRow = scn.glyph(topic, rep, dem);
let textColl = msc.repeat(textRow, dt, {attribute: "Topic", layout: msc.layout("grid", {numCols: 1, rowGap: 40})});
msc.classify(textColl, {attribute: "Comparison", layout: msc.layout("grid", {numCols: 1, rowGap: 10})});

scn.mark("image", {src: "/demos/img/republican.png", x: 100, y: 50, width: 25, height: 25});
scn.mark("line", {x1: 100, y1: 77, x2: 500, y2: 77, strokeColor: "#ddd"});
scn.mark("text", {x: 135, y: 65, anchor: ["left", "middle"], fillColor: "#a20e19", fontWeight: "bold", fontSize: "1em", text: "Topics Mentioned More by Republicans"});
scn.mark("image", {src: "/demos/img/democrat.png", x: 100, y: 300, width: 25, height: 25});
scn.mark("line", {x1: 100, y1: 327, x2: 500, y2: 327, strokeColor: "#ddd"});
scn.mark("text", {x: 135, y: 315, anchor: ["left", "middle"], fillColor: "#185a97", fontWeight: "bold", fontSize: "1em", text: "Topics Mentioned More by Democrats"});

let enc = msc.encode(line.vertices[0], "x", "Republican");
msc.encode(line.vertices[1], "x", "Democrat", {shareScale: enc});
enc.rangeExtent = 400;

msc.encode(topic, "text", "Topic");
msc.encode(rep, "text", "Republican");
msc.encode(dem, "text", "Democrat");
msc.encode(line, "strokeColor", "Comparison", {mapping: {"Mentioned more by Republicans": "#f8ecf3", "Mentioned more by Democrats": "#e1f1fc"}});

msc.update(line.vertices[0], {shape: "circle", radius: 4, fillColor: "#a20e19"});
msc.update(line.vertices[1], {shape: "circle", radius: 4, fillColor: "#185a97"});

scn.axis("x", "Republican", {orientation: "bottom", title: "Number of Mentions"});