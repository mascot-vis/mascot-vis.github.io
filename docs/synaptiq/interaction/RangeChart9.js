let enc = scn.getEncoding('Min', 'x'),
    xAxis = scn.getAxis('Min', 'x'),
    rect = scn.findElements([{property: "type", value: "rect"}])[0];

let trigger = { target: xAxis, event: "dragX" },
    responder = { component: enc, properties: ["rangeExtent"] },
    updater = (condMet, ctx, compnt) => {
        compnt.rangeExtent = compnt.getRangeExtent(rect.leftSegment) + ctx.get("dx");
    };
let tg = scn.activate(trigger, responder, undefined, updater);
