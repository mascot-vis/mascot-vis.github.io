let scene = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/UMDvsUNC-D2O+sententree_msp0.10.json");
// let data = await msc.graphJSON("/datasets/graphjson/emergency+sententree_msp0.05.json");
let node = scene.mark("text", {x: 120, y: 120}),
    link = scene.mark("bezierCurve", {sourceAnchor: ["center", "bottom"], targetAnchor: ["center", "top"], sourceOffset: [0, 2], targetOffset: [0, -3], orientation: "vertical", strokeColor: "#C8E6FA"});
    //link = scene.mark("bezierCurve", {sourceAnchor: ["right", "middle"], targetAnchor: ["left", "middle"], sourceOffset: [2, 0], targetOffset: [-3, 0], orientation: "horizontal", strokeColor: "#C8E6FA"});
    let [nodes, links] = scene.repeat([node, link], data);
scene.encode(node, {attribute: "name", channel: "text"});
nodes.layout = msc.layout("directedGraph", {top: 100, left: 100, edgeSep: 100});
// //scene.encode(node, {attribute: "average_index", channel: "y", rangeExtent: 800, flipScale: true});
scene.encode(link, {channel: "strokeWidth", attribute: "count", rangeExtent: 20});
let linkWeight = scene.mark("text", {fillColor: "#006594", fontSize: "10px"});
let lws = scene.repeat(linkWeight, data.linkTable);
scene.encode(linkWeight, {attribute: "count", channel: "text"});
scene.affix(linkWeight, link, "x");
scene.affix(linkWeight, link, "y");

// scene.find([{attribute: "name", values: ["_Start"]}, {type: "pointText"}]).forEach(d => d.visibility = "hidden");
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
//     let c = data.getNode(l.dataScope.getAttributeValue("target")),
//         p = data.getNode(l.dataScope.getAttributeValue("source"));
//     if (c["average_index"] == p["average_index"])
//         l.visibility = "hidden";
// }

// for (let l of lws.children) {
//     let c = data.getNode(l.dataScope.getAttributeValue("target")),
//         p = data.getNode(l.dataScope.getAttributeValue("source"));
//     if (c["average_index"] == p["average_index"])
//         l.visibility = "hidden";
// }