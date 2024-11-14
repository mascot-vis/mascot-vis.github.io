let scene = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/AAAsample_ed2+sententree_msp0.05.json");
let link = scene.mark("bezierCurve", {
    sourceAnchor: ["center", "bottom"],
    targetAnchor: ["center", "top"],
    sourceOffset: [0, 2],
    targetOffset: [0, -2],
    orientation: "vertical",
    strokeColor: "#C8E6FA",
});
let node = scene.mark("text", { x: 100, y: 100, fontSize: "10px" });
let [nodes, _] = scene.repeat([node, link], data);

// console.log(node);
// console.log(data);
// console.log(link);

// scene.encode(link, { channel: "strokeWidth", attribute: "count", rangeExtent: 20 });
// let linkWeight = scene.mark("text", {
//     fillColor: "#006594",
//     fontSize: "11px",
//     fontWeight: "bold"
// });
// let lws = scene.repeat(linkWeight, data.linkTable);
// scene.encode(linkWeight, { attribute: "count", channel: "text" });
// scene.affix(linkWeight, link, "x");
// scene.affix(linkWeight, link, "y");

// scene.encode(node, { attribute: "event_attribute", channel: "text" });
// nodes.layout = msc.layout("directedGraph", { top: 100, left: 100, edgeSep: 100 });