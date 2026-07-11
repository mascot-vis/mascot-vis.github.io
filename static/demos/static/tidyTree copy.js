let scene = msc.scene();
let tree = await msc.treejson("/datasets/treejson/emergency_unit.json");
let node = scene.mark("text", {x: 100, y: 100, fontSize: "12.5px", fontWeight: "bold"}),
    link = scene.mark("link", {sourceAnchor: ["center", "bottom"], targetAnchor: ["center", "top"], strokeColor: "#eee", sourceOffset: [0, 2], targetOffset: [0, -2], linkMode: "curveVertical"});
let [nodes, links] = msc.repeat([node, link], tree);
msc.encode(node, "text", "event");
nodes.layout = msc.layout("tidytree", {width: 300, height: 500, orientation: "vertical"});
msc.encode(node, "y", "average_index", {rangeExtent: 400, flipScale: true});
msc.encode(link, "strokeWidth", "child.value", {range: [1, 12]});

let lbl = scene.mark("text", {x: 100, y: 100, fontSize: "12px", fillColor: "#222"});
let lbls = msc.repeat(lbl, tree.linkTable);
msc.encode(lbl, "text", "child.value");
msc.affix(lbl, link, "x");
msc.affix(lbl, link, "y");
scene.find([{attribute: "event", values: ["Start"]}, {type: "pointText"}]).forEach(d => d.visibility = "hidden");


for (let l of lbls.children) {
    let c = tree.getNode(l.datum["child"]),
        p = tree.getNode(l.datum["parent"]);
    if (c["average_index"] == p["average_index"])
        l.visibility = "hidden";
}