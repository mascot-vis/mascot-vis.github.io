let scene = msc.scene();
let data = await msc.csv("/datasets/csv/unemployment-2.csv");
let rect = scene.mark("rect", {top:60, left: 100, width: 800, height: 450, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});

// // rect.divide first
// let industries = msc.divide(rect, {"partitionType":'divide', "orientation": "horizontal", "attribute": "industry", "datatable": data});
// let anyArea = msc.divide(industries.firstChild, {"partitionType":'BoundaryPartition', "orientation": "horizontal", "attribute": "date", "datatable": data});

// rect.densify first
let anyArea = msc.densify(rect, data, {orientation: "horizontal", attribute: "date"});
let {newMark:area, collection:areas} = msc.divide(anyArea, data, {orientation: "vertical", attribute: "industry"});
msc.update(areas.layout, {vertCellAlignment: "bottom"});

msc.encode(area, "fillColor", "industry", {mapping: {"Manufacturing": "#7fc97f", "Leisure and hospitality": "#beaed4", "Business services": "#fdc086", "Construction": "#ffff99"}});
msc.encode(area, "height", "unemployments");
let xEnc = msc.encode(area.topLeftVertex, "x", "date", {rangeExtent: 700});
msc.encode(area.bottomLeftVertex, "x", "date", {shareScale: xEnc});

scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y"});
scene.axis("height", "unemployments", {orientation: "left", titleOffset: 50});
scene.legend("fillColor", "industry", {x: 580, y: 100});

scene.state.set("selectedIndustries", ['Manufacturing', 'Leisure and hospitality', 'Business services', 'Construction']);
let trigger = { source: ["checkbox0", "checkbox1", "checkbox2", "checkbox3"], event: "change" },
    responder = { object: area, properties: ["visibility"] },
    evalFn =  (evtCtx, stateCtx, respObj) => {
        let list = stateCtx.get("selectedIndustries") || [];
        if (evtCtx.get("checked"))
            list.includes(evtCtx.get("inputValue")) || list.push(evtCtx.get("inputValue"));
        else
            list = list.filter(d => d !== evtCtx.get("inputValue"));
        stateCtx.set("selectedIndustries", list);
        return list.includes(respObj.datum["industry"]);
    },
    fn = (evalResult, evtCtx, stateCtx, respObj) => {
        if (evalResult) {
            respObj.visibility = "visible";
        } else {
            respObj.visibility = "hidden";
        }
    };

let tg = msc.activate(trigger, responder, evalFn, fn);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scene);
