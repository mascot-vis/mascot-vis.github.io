let dateLine = scn.mark("line", {x1: 51, y1: 30, x2: 51, y2: 270, strokeColor: "#aaa", strokeWidth: 1}),
    dateLabel = scn.mark("text", {text: "Jan 2000", x: 200, y: 22, fillColor: "#aaa"}),
    yEnc = scn.getEncoding('value', 'y'),
    xEnc = scn.getEncoding('index', 'x'),
    vertex = scn.findElements([{property: "type", value: "path"}])[0].vertices[0];

let trigger = { target: "background", event: "hover" },
    responder = { component: yEnc, properties: ["transform"] },
    fn = (condMet, ctx, compnt) => {
        let x = ctx.get("x");
        let date = xEnc.getAttrValue(x, vertex);
        if (date) {
            compnt.transform = (d, elem) => {
                let ds = elem.dataScope.derive({"index": date}), base = ds.getAttrVal("value");
                return (d - base)/base;
            };
            dateLine.x = xEnc.getChannelValue(date, vertex);
            dateLabel.x = dateLine.x;
            dateLabel.text = (new Date(date)).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
    };
let tg = scn.activate(trigger, responder, undefined, fn);