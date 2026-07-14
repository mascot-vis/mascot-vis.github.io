let scene = msc.scene();
let tree = await msc.treeJSON("/datasets/treejson/emergency_unit.json");

let node = scene.mark("text", {x: 100, y: 100, fontSize: "12.5px", fontWeight: "bold"}),
    link = scene.mark("bezierCurve", {sourceAnchor: ["center", "bottom"], targetAnchor: ["center", "top"], strokeColor: "#eee", sourceOffset: [0, 2], targetOffset: [0, -2], orientation: "vertical"});
let [nodes, links] = msc.repeat([node, link], tree);
msc.encode(node, "text", "event");
nodes.layout = msc.layout("tidyTree", {width: 300, height: 450, orientation: "vertical"});
// msc.encode(node, {attribute: "average_index", channel: "y", rangeExtent: 400, flipScale: true});
msc.encode(link, "strokeWidth", "child.value", {rangeExtent: 12});

let lbl = scene.mark("text", {x: 100, y: 100, fontSize: "12px", fillColor: "#222"});
let lbls = msc.repeat(lbl, tree.linkTable);
msc.encode(lbl, "text", "child.value");
msc.affix(lbl, link, "x");
msc.affix(lbl, link, "y");