let scn = msc.scene();
let dt = await msc.csv("datasets/csv/gdp-lifeExp.csv");
let circle = scn.mark("circle", { radius: 6, x: 100, y: 80, fillColor: "orange", strokeWidth: 0 });
let collection = msc.repeat(circle, dt, { attribute: "Country" });

let xEncoding = msc.encode(circle, "x", "GDP per capita", {scaleType: "log"});
let yEncoding = msc.encode(circle, "y", "Life expectancy");
let fillEncoding = msc.encode(circle, "fillColor", "Continent");

scn.axis("x", "GDP per capita", { orientation: "bottom", labelFormat: ".2s" });
scn.axis("y", "Life expectancy", { orientation: "left" });

let legend = scn.legend("fillColor", "Continent", { x: 600, y: 250 });
scn.gridlines("x", "GDP per capita");
scn.gridlines("y", "Life expectancy");

let clickTrigger = { event: "click", source: circle },
    stateResponder = { object: scn.state, properties: ["selected"] },
    stateUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
        if (!stateCtx.has("selected"))
            stateCtx.set("selected", []);
        let selected = stateCtx.get("selected");
        let element = evtCtx.get("element");
        if (element) {
            let val = element.datum["Continent"];
            let idx = selected.indexOf(val);
            if (idx === -1) {
                selected.push(val);
            } else {
                selected.splice(idx, 1);
            }
        } else
            stateCtx.set("selected", []);
    };
msc.activate(clickTrigger, stateResponder, undefined, stateUpdater);

let stateTrigger = { event: "change", source: scn.state.var("selected") },
    markResponder = { object: circle, properties: ["fillColor", "z"] },
    matchContinent = (evtCtx, stateCtx, respObj) => {
      if (!stateCtx.has("selected") || stateCtx.get("selected").length === 0) return true;
      else return stateCtx.get("selected").includes(respObj.datum["Continent"]);
    },
    markUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
        if (!evalResult) {
            respObj.fillColor = '#eee';
            respObj.z = -1;
        }
    };
let tg1 = msc.activate(stateTrigger, markResponder, matchContinent, markUpdater);

let trigger = { event: "hover", source: circle },
    responder = { object: circle, properties: ["strokeColor", "strokeWidth"] },
    matchCountry = (evtCtx, stateCtx, respObj) => respObj === evtCtx.get("element"),
    highlighter = (evalResult, evtCtx, stateCtx, respObj) => {
        if (evalResult) {
            respObj.strokeColor = 'black';
            respObj.strokeWidth = 2;
        }
    };
let tg2 = msc.activate(trigger, responder, matchCountry, highlighter);


let tooltip = scn.mark("text", { x: 100, y: 100, text: "", visibility: "hidden", anchor: ["left", "top"], backgroundColor: "#fff" });
let tooltipResponder = { object: tooltip, properties: ["visibility", "x", "y", "text"] },
    triggerElemExists = (evtCtx, stateCtx, respObj) => evtCtx.get("element") !== undefined,
    tooltipEffect = function (evalResult, evtCtx, stateCtx, respObj) {
        if (evalResult) {
            let elem = evtCtx.get("element");
            respObj.visibility = "visible";
            respObj.x = evtCtx.get("x") + 12;
            respObj.y = evtCtx.get("y") + 12;
            respObj.text = elem.datum["Country"] + ": " + elem.datum["GDP per capita"] + ", " + elem.datum["Life expectancy"];
        }
    };
let tg3 = msc.activate(trigger, tooltipResponder, triggerElemExists, tooltipEffect);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);
