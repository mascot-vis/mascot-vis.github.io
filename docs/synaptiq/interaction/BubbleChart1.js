let xEncoding = scn.getEncoding('probability', 'x'),
    yEncoding = scn.getEncoding('Average annual wage', 'y');

let trigger = { target: "background", event: "scroll" },
    responder = { component: [xEncoding, yEncoding], properties: ["domain"] },
    updater = (condMet, ctx, compnt) => {
        let dy = ctx.get("deltaY"), dir = dy > 0 ? 1 : dy < 0 ? -1 : 0;
        for (let c of compnt) {
            c.zoom(dir, c.channel === "x" ? ctx.get("x") : ctx.get("y"), 0.05);
        } 
    };
let tg1 = scn.activate(trigger, responder, undefined, updater);

let trigger2 = { target: "background", event: "drag" },
    responder2 = { component: [xEncoding, yEncoding], properties: ["domain"] },
    updater2 = (condMet, ctx, compnt) => {
        let dx = ctx.get("dx"), dy = ctx.get("dy"),
            x = ctx.get("x"), y = ctx.get("y");
         for (let c of compnt) {
            c.pan(c.channel === "x" ? x : y, c.channel === "x" ? dx : dy);
        } 
    };
let tg2 = scn.activate(trigger2, responder2, undefined, updater2);

// let circle = scn.findElements([{property: "type", value: "circle"}])[0],
//     trigger = { event: "brush", target: circle.parent },
//     responder = { component: circle, channels: ["fillColor", "opacity"] },
//     evalFn = (ctx, compnt) => {
//         let xInt = ctx.get("xInterval"), yInt = ctx.get("yInterval");
//         return (!xInt && !yInt) || (compnt.x >= xInt[0] && compnt.x <= xInt[1] && compnt.y >= yInt[0] && compnt.y <= yInt[1]);
//     },
//     highlighter = (condMet, ctx, compnt) => {
//         if (!condMet) {
//             scn.setProperties(compnt, {
//                 fillColor: '#eee',
//                 opacity: 0.5
//             }, true);
//         }
//     };
// let tg1 = scn.activate(trigger, responder, evalFn, highlighter);