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

let circle = scn.mark("circle", {x: 200, y: 100, radius: 3, visibility: "hidden", strokeWidth: 2});
msc.repeat(circle, dt, {attribute: "company"});
msc.encode(circle, "strokeColor", "company", {sharedScale: colorEnc});

let tooltip = scn.mark("richText", {text: "0", width: "100px", opacity: 1, anchor: ["left", "top"], backgroundColor: "#fff", visibility: "hidden"});
msc.attach(tooltip, dt);

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

let tooltipResp = { object: tooltip, properties: ["x", "y", "text", "visibility"] },
    tooltipUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
        let date = evtCtx.get("xVal");
        let values = ["AAPL", "AMZN", "IBM", "MSFT"].map((company) => {
            let rows = respObj.data.filter((d) => d["date"] == date && d["company"] == company);
            return rows.length > 0 ? `${company}: ${rows[0]["price"]}` : `${company}: N/A`;
        });
        respObj.x = xEnc.getChannelValue(date) + 5;
        respObj.y = evtCtx.get("y") + 5;
        respObj.text = values.join("<br>");
        respObj.visibility = "visible";
    };
msc.activate(trigger, tooltipResp, undefined, tooltipUpdater);

msc.renderer("svg", "svgElement").render(scn)