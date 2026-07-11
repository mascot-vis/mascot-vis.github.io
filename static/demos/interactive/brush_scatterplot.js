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

let trigger = { event: "brush", source: collection },
    responder = { object: circle, properties: ["fillColor", "opacity"] },
    evalFn = (evtCtx, stateCtx, respObj) => {
        let xInt = evtCtx.get("xCoords"), yInt = evtCtx.get("yCoords");
        return (!xInt && !yInt) || (respObj.x >= xInt[0] && respObj.x <= xInt[1] && respObj.y >= yInt[0] && respObj.y <= yInt[1]);
    },
    highlighter = (evalResult, evtCtx, stateCtx, respObj) => {
        if (!evalResult) {
            respObj.fillColor = '#eee';
            respObj.opacity = 0.5;
        }
    };
let tg1 = msc.activate(trigger, responder, evalFn, highlighter);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);
