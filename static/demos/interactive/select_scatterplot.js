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

// scn.onChange('channel', "x", circle), the dependency graph will automatically update the circle’s bounding box, but this works for one circle only. Modify the code so that it can handle all the circles after the repeat operation. 
// scn.setChannels(circle, {“radius”: 25}) this should update the radius of all the repeated circles to 25, and trigger the dep graph propagation 
// circle._radius = 25, this should only update the radius of one particular circle

// //Country,GDP per capita,Life expectancy,Population,Continent
let xEncoding = msc.encode(circle, { attribute: "GDP per capita", channel: "x" });
let yEncoding = msc.encode(circle, { attribute: "Life expectancy", channel: "y" });
let fillEncoding = msc.encode(circle, { attribute: "Continent", channel: "fillColor" });
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

let selectTrigger = { event: "click", target: circle, cumulative: true },
    selectResponder = { component: circle, channels: ["fillColor", "opacity"] },
    matchContinent = (ctx, compnt) => (!ctx.get("element") || ctx.get("elements").map(d => d.dataScope.getAttrVal("Continent")).includes(compnt.dataScope.getAttrVal("Continent"))),
    selectEffect = (condMet, ctx, compnt) => {
        if (!condMet) {
            compnt.fillColor = '#eee';
            compnt.opacity = 0.5;
        }
    };
let tg1 = msc.activate(selectTrigger, selectResponder, matchContinent, selectEffect);

let trigger = { event: "hover", target: circle },
    responder = { component: circle, channels: ["strokeColor", "strokeWidth"] },
    matchCountry = (ctx, compnt) => compnt === ctx.get("element"),
    highlighter = (condMet, ctx, compnt) => {
        if (condMet) {
            compnt.strokeColor = 'black';
            compnt.strokeWidth = 2;
        }
    };
let tg2 = msc.activate(trigger, responder, matchCountry, highlighter);


let tooltip = scn.mark("text", { x: 100, y: 100, text: "", visibility: "hidden", anchor: ["left", "top"], backgroundColor: "#fff" });
let tooltipResponder = { component: tooltip, channels: ["visibility", "x", "y", "text"] },
    triggerElemExists = (ctx, compnt) => ctx.get("element") !== undefined,
    tooltipEffect = function (condMet, ctx, compnt) {
        if (condMet) {
            let ds = ctx.get("element").dataScope;
            compnt.visibility = "visible";
            compnt.x = ctx.get("x") + 12;
            compnt.y = ctx.get("y") + 12;
            compnt.text = ds.getAttrVal('Country') + ": " + ds.getAttrVal('GDP per capita') + ", " + ds.getAttrVal('Life expectancy');
        }
    };
let tg3 = msc.activate(trigger, tooltipResponder, triggerElemExists, tooltipEffect);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);