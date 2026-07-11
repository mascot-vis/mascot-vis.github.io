let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/stocks.csv");

// Initial base date: the earliest date in the dataset
let initialBaseDate = dt.summary("date").min;

// Custom transform: adds "price_indexed" = (price - basePrice) / basePrice
// where basePrice is the stock price of the same company on spec.baseDate.
let indexSpec = msc.transform("custom", (inTbl, outTbl, spec) => {
        let prices    = inTbl.values("price"),
            companies = inTbl.unique("company");
        let basePrices = {};
        companies.forEach(c => basePrices[c] = inTbl.rows({company: c, date: spec.baseDate})[0]?.price);
        let indexed = prices.map((p, i) => {
            let base = basePrices[inTbl.data[i].company];
            return base != null ? (p - base) / base : 0;
        });
        outTbl.addAttr("price_indexed", "number", indexed);
    }, { baseDate: initialBaseDate }
);

// Derive a new table that has "price_indexed" in addition to the original columns.
let data = scn.derive(dt, indexSpec);

let line = scn.mark("line", {x1: 200, y1: 100, x2: 800, y2: 500, strokeColor: "green", strokeWidth: 2});
let collection = msc.repeat(line, data, {attribute: "company"});
let polyLine = msc.densify(line, data, {attribute: "date"});

let vertex = polyLine.vertices[0];
let xEnc = msc.encode(vertex, "x", "date");
msc.encode(vertex, "y", "price_indexed");
msc.encode(polyLine, "strokeColor", "company");

scn.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y"});
scn.axis("y", "price_indexed", {orientation: "left", labelFormat: ".0%", titleVisible: false});
scn.legend("strokeColor", "company", {x: 900, y: 100});
scn.gridlines("y", "price_indexed");

let dateLine = scn.mark("line", {x1: 200, y1: 100, x2: 200, y2: 500, strokeColor: "#aaa", strokeWidth: 1}),
    dateLabel = scn.mark("text", {text: "", x: 200, y: 92, fillColor: "#aaa"});

// On hover: update indexSpec.baseDate to re-run the custom transform and re-scale the chart.
let trigger   = { source: "background", event: "hover" },
    responder  = { object: indexSpec, properties: ["baseDate"] },
    responder2 = { object: dateLine,  properties: ["x"] },
    responder3 = { object: dateLabel, properties: ["x", "text"] };

let fn = (evalResult, evtCtx, stateCtx, respObj) => {
        let date = evtCtx.get("xVal");
        if (date) respObj.baseDate = date;
    },
    fn1 = (evalResult, evtCtx, stateCtx, respObj) => {
        let date = evtCtx.get("xVal");
        if (date) respObj.x = xEnc.getChannelValue(date);
    },
    fn2 = (evalResult, evtCtx, stateCtx, respObj) => {
        let date = evtCtx.get("xVal");
        if (date) {
            respObj.x = xEnc.getChannelValue(date);
            respObj.text = (new Date(date)).toLocaleString('en-US', { year: 'numeric', month: 'short' });
        }
    };

msc.activate(trigger, responder,  undefined, fn);
msc.activate(trigger, responder2, undefined, fn1);
msc.activate(trigger, responder3, undefined, fn2);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);
