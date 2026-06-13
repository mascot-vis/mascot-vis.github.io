let scene = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/UMDvsUNC-D2O+sententree_msp0.10.json");
let node = scene.mark("text", {x: 120, y: 120}),
    link = scene.mark("bezierCurve", {sourceAnchor: ["center", "bottom"], targetAnchor: ["center", "top"], sourceOffset: [0, 2], targetOffset: [0, -3], orientation: "vertical", strokeColor: "#C8E6FA"});
    let [nodes, links] = msc.repeat([node, link], data);
msc.encode(node, {attribute: "name", channel: "text"});
nodes.layout = msc.layout("directedGraph", {top: 100, left: 100, edgeSep: 100});
msc.encode(link, {channel: "strokeWidth", attribute: "count", rangeExtent: 20});
let linkWeight = scene.mark("text", {fillColor: "#006594", fontSize: "10px"});
let lws = msc.repeat(linkWeight, data.linkTable);
msc.encode(linkWeight, {attribute: "count", channel: "text"});
msc.affix(linkWeight, link, "x");
msc.affix(linkWeight, link, "y");

let trigger = { event: "hover", target: node },
    responder = { component: link, channels: ["strokeColor"] },
    evalFn = (ctx, compnt) => compnt.source === ctx.get("element"),
    highlighter = (condMet, ctx, compnt) => {
        if (condMet) {
            compnt.strokeColor = 'orange';
        }
    };
let tg1 = msc.activate(trigger, responder, evalFn, highlighter);

let nodeResponder = { component: node, channels: ["fontWeight"] },
    evalFn2 = (ctx, compnt) => compnt === ctx.get("element"),
    nodeBolder = (condMet, ctx, compnt) => {
        if (condMet) {
            compnt.fontWeight = 'bold';
        } 
    };
let tg2 = msc.activate(trigger, nodeResponder, evalFn2, nodeBolder);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scene);