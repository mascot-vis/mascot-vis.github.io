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

msc.encode(area, {channel: "fillColor", attribute: "industry", mapping: {"Manufacturing": "#7fc97f", "Leisure and hospitality": "#beaed4", "Business services": "#fdc086", "Construction": "#ffff99"}});
msc.encode(area, {channel: "height", attribute: "unemployments"});
let xEnc = msc.encode(area.topLeftVertex, {channel: "x", attribute: "date", rangeExtent: 700});
msc.encode(area.bottomLeftVertex, {channel: "x", attribute: "date", shareScale: xEnc});

scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y"});
scene.axis("height", "unemployments", {orientation: "left", titleOffset: 50});
scene.legend("fillColor", "industry", {x: 580, y: 100});

let industries = ['Manufacturing', 'Leisure and hospitality', 'Business services', 'Construction'],
    list = industries.slice();
let trigger = { target: ["checkbox0", "checkbox1", "checkbox2", "checkbox3"], event: "change" },
    responder = { component: area, channels: ["visibility"] },
    evalFn =  (ctx, compnt) => {
        if (ctx.get("checked"))
            list.includes(ctx.get("inputValue")) || list.push(ctx.get("inputValue"));
        else
            list = list.filter(d => d !== ctx.get("inputValue"));
        return list.includes(compnt.dataScope.getAttrVal("industry"));
    },
    fn = (condMet, ctx, compnt) => {
        if (condMet) {
            compnt.visibility = "visible";
        } else {
            compnt.visibility = "hidden";
        }
    };

let tg = msc.activate(trigger, responder, evalFn, fn);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scene);