let scene = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/miserables.json");

let node = scene.mark("circle", {radius: 6, x: 100, y: 90}),
    link = scene.mark("bundledPath", {strength: 0});

let [nodes, links] = msc.repeat([node, link], data);
//msc.sortChildren(nodes, "group");
//scene.setLayout(nodes, msc.layout("circular", {x: 400, y: 350, radius: 200}));
let nodeTree = data.buildNodeHierarchy(["group"]);
scene.setLayout(nodes, msc.layout("cluster", {tree: nodeTree, radial: true, x: 400, y: 350, angleExtent: 360, radius: 200}));
msc.encode(node, "fillColor", "group");
scene.axis("angle", "id", {tickVisible: false, pathVisible: false, titleVisible: false});

let inputTrigger = { event: "input", source: "my-slider" },
    responder = { object: link, properties: ["strength"] },
    callback = (evalResult, evtCtx, stateCtx, respObj) => {
        respObj.strength = evtCtx.get("inputValue");
    }
let tg = msc.activate(inputTrigger, responder, undefined, callback);

let trigger = { event: "hover", source: node },
    nodeResponder = { object: node, properties: ["strokeColor", "strokeWidth"] },
    matchNode = (evtCtx, stateCtx, respObj) => respObj === evtCtx.get("element"),
    highlighter = (evalResult, evtCtx, stateCtx, respObj) => {
        if (evalResult) {
            respObj.strokeColor = 'black';
            respObj.strokeWidth = 2;
        }
    };
msc.activate(trigger, nodeResponder, matchNode, highlighter);

let linkResponder = { object: link, properties: ["opacity"] },
    respEval = (evtCtx, stateCtx, respObj) => !evtCtx.get("element") || respObj.source === evtCtx.get("element") || respObj.target === evtCtx.get("element"),
    linkHighlighter = (evalResult, evtCtx, stateCtx, respObj) => {
        if (!evalResult) {
            respObj.opacity = 0.02;
        }
    };
msc.activate(trigger, linkResponder, respEval, linkHighlighter);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scene);
