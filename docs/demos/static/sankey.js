let scene = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/energyFlow.json");

let node = scene.mark("rect", {left: 0, top: 0, width: 16, height: 20, fillColor: "#4C78A8", strokeWidth: 0}),
    link = scene.mark("bezierCurve", {sourceAnchor: ["right", "middle"], targetAnchor: ["left", "middle"], sourceOffset: [2, 0], targetOffset: [-3, 0], orientation: "horizontal", strokeColor: "#9ECAE1", opacity: 0.55});

let [nodes, links] = msc.repeat([node, link], data);

msc.encode(node, "height", "value", {rangeExtent: 130});
msc.encode(node, "fillColor", "col", {scheme: "interpolateWarm"});

nodes.layout = msc.layout("directedGraph", {top: 60, left: 80, edgeSep: 24, direction: "l2r", rankSep: 150, nodeSep: 60});

msc.encode(link, "strokeWidth", "value", {rangeExtent: 65});

let label = scene.mark("text", {fillColor: "#333", fontSize: "11px"});
msc.repeat(label, data.nodeTable);
msc.encode(label, "text", "id");
msc.affix(label, node, "x", {elementAnchor: "left", baseAnchor: "right", offset: 6});
msc.affix(label, node, "y");
