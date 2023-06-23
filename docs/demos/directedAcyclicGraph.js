let scene = msc.scene();
let data = await msc.graphjson("datasets/graphjson/UMDvsUNC-D2O+sententree_msp0.10.json");
let node = scene.mark("text", {x: 120, y: 120}),
    link = scene.mark("link", {sourceAnchor: ["center", "bottom"], targetAnchor: ["center", "top"], sourceOffset: [0, 2], targetOffset: [0, -2], mode: "curveVertical", strokeColor: "#C8E6FA"});
// let links = scene.repeat(link, data.linkTable); 
// let nodes = scene.repeat(node, data.nodeTable);
let [nodes, links] = scene.repeat([node, link], data);
scene.encode(node, {field: "event_attribute", channel: "text"});
nodes.layout = msc.layout("sugiyama", {top: 100, left: 100, edgeSep: 100});
//scene.encode(node, {field: "average_index", channel: "y", rangeExtent: 800, flipScale: true});
scene.encode(link, {channel: "strokeWidth", field: "count", range: [1, 6]});
let linkWeight = scene.mark("text", {fillColor: "#006594", fontSize: "10px"});
let lws = scene.repeat(linkWeight, data.linkTable);
scene.encode(linkWeight, {field: "count", channel: "text"});
scene.affix(linkWeight, link, "x");
scene.affix(linkWeight, link, "y");
scene.find([{field: "event_attribute", values: ["_Start"]}, {type: "pointText"}]).forEach(d => d.visibility = "hidden");
//scene.axis("y", "average_index", {"x": 50});
// for (let l of lws.children) {
//     for (let n of nodes.children) {
//         if (l.bounds.overlap(n.bounds)) {
//             l.visibility = "hidden";
//             break;
//         }
//     }        
// }
// for (let l of links.children) {
//     let c = data.getNode(l.dataScope.getFieldValue("target")),
//         p = data.getNode(l.dataScope.getFieldValue("source"));
//     if (c["average_index"] == p["average_index"])
//         l.visibility = "hidden";
// }

// for (let l of lws.children) {
//     let c = data.getNode(l.dataScope.getFieldValue("target")),
//         p = data.getNode(l.dataScope.getFieldValue("source"));
//     if (c["average_index"] == p["average_index"])
//         l.visibility = "hidden";
// }