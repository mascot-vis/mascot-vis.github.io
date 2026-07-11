let scn = msc.scene();
let dt = await msc.csv("datasets/csv/gdp-lifeExp.csv");
let circle = scn.mark("circle", { radius: 6, x: 100, y: 80, fillColor: "orange", strokeWidth: 0 });
// circle._x = 130;
// scn.onChange('channel', "x", circle);
// console.log("here2", circle.bounds);
let collection = msc.repeat(circle, dt, { attribute: "Country" });
// scn.setChannels(circle, { 'radius': 25 });
// console.log("circle bounds", circle.bounds);
// console.log('peer bounds', collection.children.map(d => d.bounds));

// scn.onChange('channel', "x", circle), the dependency graph will automatically update the circle's bounding box, but this works for one circle only. Modify the code so that it can handle all the circles after the repeat operation. 
// scn.setChannels(circle, {"radius": 25}) this should update the radius of all the repeated circles to 25, and trigger the dep graph propagation 
// circle._radius = 25, this should only update the radius of one particular circle

// //Country,GDP per capita,Life expectancy,Population,Continent
let xEncoding = msc.encode(circle, "x", "GDP per capita");
let yEncoding = msc.encode(circle, "y", "Life expectancy");
let fillEncoding = msc.encode(circle, "fillColor", "Continent");
// scn.onChange('rangeExtent', xEncoding);
// yEncoding.rangeExtent = 0;
// scn.onChange('rangeExtent', yEncoding);
// console.log('xEncoding', xEncoding)
// console.log('yEncoding', yEncoding)

scn.axis("x", "GDP per capita", { orientation: "bottom", labelFormat: ".2s" });
xEncoding.rangeExtent = 800;
// yEncoding.includeZero = true;
scn.axis("y", "Life expectancy", { orientation: "left" });

let legend = scn.legend("fillColor", "Continent", { x: 600, y: 250 });
scn.gridlines("x", "GDP per capita");
scn.gridlines("y", "Life expectancy");

let selectTrigger = { event: "click", source: circle },
    selectResponder = { object: circle, properties: ["fillColor", "opacity", "z"] },
    matchContinent = (evtCtx, stateCtx, respObj) => (!evtCtx.get("element") || evtCtx.get("element").datum["Continent"] === respObj.datum["Continent"]),
    selectEffect = (evalResult, evtCtx, stateCtx, respObj) => {
        if (!evalResult) {
            respObj.fillColor = '#eee';
            respObj.opacity = 0.8;
            respObj.z = -1;
        } 
    };
let tg1 = msc.activate(selectTrigger, selectResponder, matchContinent, selectEffect);

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
            let d = evtCtx.get("element").datum;
            respObj.visibility = "visible";
            respObj.x = evtCtx.get("x") + 12;
            respObj.y = evtCtx.get("y") + 12;
            respObj.text = d['Country'] + ": " + d['GDP per capita'] + ", " + d['Life expectancy'];
        }
    };
let tg3 = msc.activate(trigger, tooltipResponder, triggerElemExists, tooltipEffect);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);
