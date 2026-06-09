let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/stocks.csv");
let line = scn.mark("line", {x1: 200, y1: 100, x2: 400, y2: 400, strokeColor: "green", strokeWidth: 2});

let collection = msc.repeat(line, dt, {attribute: "company"});
let polyLine = msc.densify(line, dt, {attribute: "date"});

let vertex = polyLine.vertices[0];
let xEnc = msc.encode(vertex, {attribute: "date", channel: "x", rangeExtent: 600});
// let t = (d, elem, date) => {
//     let ds = elem.dataScope.derive({"date": date}), base = ds.getAttrVal("price");
//     return (d - base)/base;
// }
let yEnc = msc.encode(vertex, {attribute: "price", channel: "y"});
msc.encode(polyLine, {attribute: "company", channel: "strokeColor"});

scn.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y"});
scn.axis("y", "price", {orientation: "left", labelFormat: ".0%", titleVisible: false});
scn.legend("strokeColor", "company", {x: 900, y: 100});
scn.gridlines("y", "price");

let dateLine = scn.mark("line", {x1: 200, y1: 100, x2: 200, y2: 400, strokeColor: "#aaa", strokeWidth: 1}),
    dateLabel = scn.mark("text", {text: "Jan 2000", x: 200, y: 92, fillColor: "#aaa"});

let trigger = { target: "background", event: "hover" },
    responder = { component: yEnc, properties: ["transform"] },
    responder2 = { component: dateLine, properties: ["x"] },
    responder3 = { component: dateLabel, properties: ["x", "text"] };
let fn = (condMet, ctx, compnt) => {
        let date = ctx.get("xAttrVal");
        //let date = xEnc.getAttrValue(x, vertex);
        if (date) {
            compnt.transform = (d, elem) => {
                let ds = elem.dataScope.derive({"date": date}), base = ds.getAttrVal("price");
                return (d - base)/base;
            };
            //dateLine.x = xEnc.getChannelValue(date, vertex);
            //dateLabel.x = dateLine.x;
            //dateLabel.text = (new Date(date)).toLocaleString('en-US', { year: 'numeric', month: 'short' });
        }
    },
    
    fn1 = (condMet, ctx, compnt) => {
        let date = ctx.get("xAttrVal");
        if (date) {
            compnt.x = xEnc.getChannelValue(date);
        }
    },
    
    fn2 = (condMet, ctx, compnt) => {
        let date = ctx.get("xAttrVal");
        if (date) {
            compnt.x = xEnc.getChannelValue(date);
            compnt.text = (new Date(date)).toLocaleString('en-US', { year: 'numeric', month: 'short' });
        }
    };
let tg = msc.activate(trigger, responder, undefined, fn),
    tg2 = msc.activate(trigger, responder2, undefined, fn1),
    tg3 = msc.activate(trigger, responder3, undefined, fn2);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);