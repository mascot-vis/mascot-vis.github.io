let scene = msc.scene();
let tree = await msc.treeJSON("/datasets/treejson/emergency_unit.json");

let node = scene.mark("text", {x: 100, y: 100, fontSize: "12.5px", fontWeight: "bold"}),
    link = scene.mark("bezierCurve", {sourceAnchor: ["center", "bottom"], targetAnchor: ["center", "top"], strokeColor: "#eee", sourceOffset: [0, 2], targetOffset: [0, -2], orientation: "vertical"});
let [nodes, links] = scene.repeat([node, link], tree);
scene.encode(node, {attribute: "event", channel: "text"});
nodes.layout = msc.layout("tidyTree", {width: 300, height: 450, orientation: "vertical"});
// scene.encode(node, {attribute: "average_index", channel: "y", rangeExtent: 400, flipScale: true});
scene.encode(link, {channel: "strokeWidth", attribute: "child.value", rangeExtent: 12});

let lbl = scene.mark("text", {x: 100, y: 100, fontSize: "12px", fillColor: "#222"});
let lbls = scene.repeat(lbl, tree.linkTable);
scene.encode(lbl, {attribute: "child.value", channel: "text"});
scene.affix(lbl, link, "x");
scene.affix(lbl, link, "y");
// scene.find([{attribute: "event", values: ["Start"]}, {type: "pointText"}]).forEach(d => d.visibility = "hidden");
// for (let l of lbls.children) {
//     for (let n of nodes.children) {
//         if (l.bounds.overlap(n.bounds)) {
//             l.visibility = "hidden";
//             break;
//         }
//     }        
// }
// for (let l of links.children) {
//     let c = tree.getNode(l.dataScope.getAttributeValue("child")),
//         p = tree.getNode(l.dataScope.getAttributeValue("parent"));
//     if (c["average_index"] == p["average_index"])
//         l.visibility = "hidden";
// }

// for (let l of lbls.children) {
//     let c = tree.getNode(l.dataScope.getAttributeValue("child")),
//         p = tree.getNode(l.dataScope.getAttributeValue("parent"));
//     if (c["average_index"] == p["average_index"])
//         l.visibility = "hidden";
// }