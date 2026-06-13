let scn = msc.scene();
let line = scn.mark("line", { x1: 200, y1: 80, x2: 400, y2: 80, strokeColor: "green" });

let dt = await msc.csv("/datasets/csv/obesityEducation.csv");

msc.repeat(line, dt, { attribute: "State" });
let enc = msc.encode(line.vertices[0], { attribute: "Obesity Percentage", channel: "y" });
msc.encode(line.vertices[1], { attribute: "BA Degree Percentage", channel: "y", shareScale: enc });
//enc.domain = [15, 50];
enc.rangeExtent = 500;

msc.encode(line, { attribute: "Obesity vs Higher Education", channel: "strokeColor" });

let leftAxis = scn.axis("y", "Obesity Percentage", { orientation: "left" });
let rightAxis = scn.axis("y", "BA Degree Percentage", { orientation: "right" });
scn.legend("strokeColor", "Obesity vs Higher Education", { x: 460, y: 100 });

let obesitytrigger = { target: leftAxis, event: "brushY" },
    responder = { component: line, channels: ["strokeColor", "opacity"] },
    evalFn = (ctx, compnt) => {
        let yInt = ctx.get("yInterval");
        return !yInt || (compnt.vertices[0].y >= yInt[0] && compnt.vertices[0].y <= yInt[1])
    },
    highlighter = (condMet, ctx, compnt) => {
        if (!condMet) {
            compnt.strokeColor = '#eee';
            compnt.opacity = 0.5;
        }
    };
let tg1 = msc.activate(obesitytrigger, responder, evalFn,  highlighter);

let eduTrigger = { target: rightAxis, event: "brushY" },
    evalFn2 = (ctx, compnt) => {
        let yInt = ctx.get("yInterval");
        return !yInt || (compnt.vertices[1].y >= yInt[0] && compnt.vertices[1].y <= yInt[1])
    };
let tg2 = msc.activate(eduTrigger, responder, evalFn2, highlighter);

let trigger = { target: line,  event: "hover" },
    responder2 = { component: line, channels: ["strokeWidth"]},
    matchState = (ctx, compnt) => compnt === ctx.get("element"),
    strokeWidthEffx = (condMet, ctx, compnt) => {
        if (condMet) {
            compnt.strokeWidth = 2.5;
        }
    };
let tg3 = msc.activate(trigger, responder2, matchState, strokeWidthEffx);

let tooltip = scn.mark("text", { x: 100, y: 100, text: "", visibility: "hidden", anchor: ["left", "top"], backgroundColor: "#fff" });
let tooltipResponder = { component: tooltip, channels: ["visibility", "x", "y", "text"] },
    hitElem = (ctx, compnt) => ctx.get("element") !== undefined,
    tooltipEffect = function (condMet, ctx, compnt) {
        if (condMet) {
            let ds = ctx.get("element").dataScope;
            compnt.visibility = "visible";
            compnt.x = ctx.get("x") + 12;
            compnt.y = ctx.get("y") + 12;
            compnt.text = ds.getAttrVal('State');
        }
    };
let tg4 = msc.activate(trigger, tooltipResponder, hitElem, tooltipEffect);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);

