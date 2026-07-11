let scn = msc.scene();
let line = scn.mark("line", { x1: 200, y1: 80, x2: 400, y2: 80, strokeColor: "green" });

let dt = await msc.csv("/datasets/csv/obesityEducation.csv");

msc.repeat(line, dt, { attribute: "State" });
let enc = msc.encode(line.vertices[0], "y", "Obesity Percentage");
msc.encode(line.vertices[1], "y", "BA Degree Percentage", {shareScale: enc});
//enc.domain = [15, 50];
enc.rangeExtent = 500;

msc.encode(line, "strokeColor", "Obesity vs Higher Education");

let leftAxis = scn.axis("y", "Obesity Percentage", { orientation: "left" });
let rightAxis = scn.axis("y", "BA Degree Percentage", { orientation: "right" });
scn.legend("strokeColor", "Obesity vs Higher Education", { x: 460, y: 100 });

let obesitytrigger = { source: leftAxis, event: "brushY" },
    responder = { object: line, properties: ["strokeColor", "z"] },
    evalFn = (evtCtx, stateCtx, respObj) => {
        let yInt = evtCtx.get("yCoords");
        return !yInt || (respObj.vertices[0].y >= yInt[0] && respObj.vertices[0].y <= yInt[1])
    },
    highlighter = (evalResult, evtCtx, stateCtx, respObj) => {
        if (!evalResult) {
            respObj.strokeColor = '#eee';
            respObj.z = -1;
        }
    };
let tg1 = msc.activate(obesitytrigger, responder, evalFn,  highlighter);

let eduTrigger = { source: rightAxis, event: "brushY" },
    evalFn2 = (evtCtx, stateCtx, respObj) => {
        let yInt = evtCtx.get("yCoords");
        return !yInt || (respObj.vertices[1].y >= yInt[0] && respObj.vertices[1].y <= yInt[1])
    };
let tg2 = msc.activate(eduTrigger, responder, evalFn2, highlighter);

let trigger = { source: line,  event: "hover" },
    responder2 = { object: line, properties: ["strokeWidth"]},
    matchState = (evtCtx, stateCtx, respObj) => respObj === evtCtx.get("element"),
    strokeWidthEffx = (evalResult, evtCtx, stateCtx, respObj) => {
        if (evalResult) {
            respObj.strokeWidth = 2.5;
        }
    };
let tg3 = msc.activate(trigger, responder2, matchState, strokeWidthEffx);

let tooltip = scn.mark("text", { x: 100, y: 100, text: "", visibility: "hidden", anchor: ["left", "top"], backgroundColor: "#fff" });
let tooltipResponder = { object: tooltip, properties: ["visibility", "x", "y", "text"] },
    hitElem = (evtCtx, stateCtx, respObj) => evtCtx.get("element") !== undefined,
    tooltipEffect = function (evalResult, evtCtx, stateCtx, respObj) {
        if (evalResult) {
            respObj.visibility = "visible";
            respObj.x = evtCtx.get("x") + 12;
            respObj.y = evtCtx.get("y") + 12;
            respObj.text = evtCtx.get("element").datum["State"];
        }
    };
let tg4 = msc.activate(trigger, tooltipResponder, hitElem, tooltipEffect);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);
