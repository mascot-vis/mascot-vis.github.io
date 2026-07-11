let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/stocks_partial.csv");
let line = scn.mark("line", {x1: 200, y1: 100, x2: 400, y2: 400, strokeColor: "green", strokeWidth: 2});

let collection = msc.repeat(line, dt, {attribute: "company"});
let polyLine = msc.densify(line, dt, {attribute: "date"});

let vertex = polyLine.vertices[0];
let xEnc = msc.encode(vertex, "x", "date", {rangeExtent: 600});
let yEnc = msc.encode(vertex, "y", "price");
let colorEnc =msc.encode(polyLine, "strokeColor", "company");

scn.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y"});
scn.axis("y", "price", {orientation: "left", labelFormat: ".2s", titleVisible: false});
scn.legend("strokeColor", "company", {x: 900, y: 100});
scn.gridlines("y", "price");

let dateLine = scn.mark("line", {x1: 200, y1: 100, x2: 200, y2: 400, strokeColor: "#aaa", strokeWidth: 1}),
    dateLabel = scn.mark("text", {text: "Jan 2000", x: 200, y: 92, fillColor: "#aaa"});

let trigger = { source: "background", event: "hover" },
    lineResp = { object: dateLine, properties: ["x"] },
    lineUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
        let date = evtCtx.get("xVal");
        if (date) {
            respObj.x = xEnc.getChannelValue(date);
        }
    };
msc.activate(trigger, lineResp, undefined, lineUpdater);

let textResp = { object: dateLabel, properties: ["x", "text"] },
    textUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
        let date = evtCtx.get("xVal");
        if (date) {
            respObj.x = xEnc.getChannelValue(date);
            respObj.text = (new Date(date)).toLocaleString('en-US', { year: 'numeric', month: 'short' });
        }
    };
msc.activate(trigger, textResp, undefined, textUpdater);

let circle = scn.mark("circle", {x: 200, y: 100, radius: 5, fillColor: "#aaa", visibility: "hidden"});
msc.repeat(circle, dt, {attribute: "company"});
msc.encode(circle, "fillColor", "company", {sharedScale: colorEnc});

let priceLabel = scn.mark("text", {text: "0", x: 200, y: 100, fillColor: "#aaa", visibility: "hidden"});
msc.repeat(priceLabel, dt, {attribute: "company"});
msc.encode(priceLabel, "fillColor", "company", {sharedScale: colorEnc});

let circleResp = { object: circle, properties: ["x", "y", "visibility"] },
    evaluator = (evtCtx, stateCtx, respObj) => {
        let date = evtCtx.get("xVal"), rows = [];
        if (date) {
            rows = respObj.data.filter((d) => d["date"] == date);
        }
        return date && rows.length > 0;
    },
    circleUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
        if (evalResult) {
            let date = evtCtx.get("xVal");
            let rows = respObj.data.filter((d) => d["date"] == date);
            respObj.x = xEnc.getChannelValue(date);
            respObj.y = yEnc.getChannelValue(rows[0]["price"]);
            respObj.visibility = "visible";
        }
    };
msc.activate(trigger, circleResp, evaluator, circleUpdater);

let priceLabelResp = { object: priceLabel, properties: ["x", "y", "text", "visibility"] },
    priceLabelUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
        if (evalResult) {
            let date = evtCtx.get("xVal");
            let rows = respObj.data.filter((d) => d["date"] == date);
            respObj.x = xEnc.getChannelValue(date);
            respObj.y = yEnc.getChannelValue(rows[0]["price"]) - 10;
            respObj.text = rows[0]["price"];
            respObj.visibility = "visible";
        }
    };
msc.activate(trigger, priceLabelResp, evaluator, priceLabelUpdater);

msc.renderer("svg", "svgElement").render(scn)