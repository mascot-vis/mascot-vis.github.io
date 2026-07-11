let scn = msc.scene();
let dt = await msc.csv("datasets/csv/gdp-lifeExp.csv");
let lasso = scn.mark("path", { strokeColor: "#0A6CBD", strokeWidth: 2, closed: false, fillColor: "#90CAF9", opacity: 0.2 });

let circle = scn.mark("circle", { radius: 6, x: 100, y: 80, fillColor: "gray", strokeWidth: 0 });
let collection = msc.repeat(circle, dt, { attribute: "Country" });

let xEncoding = msc.encode(circle, "x", "GDP per capita", {rangeExtent: 800});
let yEncoding = msc.encode(circle, "y", "Life expectancy");
let fillEncoding = msc.encode(circle, "fillColor", "Continent");

scn.axis("x", "GDP per capita", { orientation: "bottom", labelFormat: ".2s" });
scn.axis("y", "Life expectancy", { orientation: "left" });

scn.legend("fillColor", "Continent", { x: 700, y: 250 });
scn.gridlines("x", "GDP per capita");
scn.gridlines("y", "Life expectancy");


let clickTrigger = { event: "click", source: collection },
    lassoResponder = { object: scn.state, properties: ["lasso"] },
    lassoUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
        if (!stateCtx.has("lasso"))
            stateCtx.set("lasso", []);
        let lasso = stateCtx.get("lasso");
        if (lasso.length > 1 && lasso[0][0] == lasso[lasso.length - 1][0] && lasso[0][1] == lasso[lasso.length - 1][1]) {
            stateCtx.set("lasso", [])
        }
        stateCtx.get("lasso").push([evtCtx.get("x"), evtCtx.get("y")]);
    };
msc.activate(clickTrigger, lassoResponder, undefined, lassoUpdater);

let espTrigger = { event: "keyup", source: "Escape" },
    espUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
        if (!stateCtx.has("lasso"))
            stateCtx.set("lasso", []);
        if (stateCtx.get("lasso").length > 0)
            stateCtx.get("lasso").push(stateCtx.get("lasso")[0]);
    };
msc.activate(espTrigger, lassoResponder, undefined, espUpdater);


let lassoTrigger = { event: "change", source: scn.state.var("lasso") },
    pathResponder = { object: lasso, properties: ["vertices"] },
    pathUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
        let lasso = stateCtx.get("lasso");
        if (lasso && lasso.length > 0) {
            respObj.vertices = lasso;
        }
        stateCtx.set("lassoMark", respObj);
    };
msc.activate(lassoTrigger, pathResponder, undefined, pathUpdater);

let mkResponder = { object: circle, properties: ["fillColor", "opacity"] },
    mkEvaluator = (evtCtx, stateCtx, respObj) => {
        let lasso = stateCtx.get("lasso");
        if (!lasso || lasso.length < 3) return false;
        return msc.contains(stateCtx.get("lassoMark"), respObj.bounds.x, respObj.bounds.y);
    },
    mkUpdater = (evalResult, evtCtx, stateCtx, respObj) => {
        if (!evalResult) {
            respObj.fillColor = "gray";
            respObj.opacity = 0.5;
        } 
    };
msc.activate(lassoTrigger, mkResponder, mkEvaluator, mkUpdater);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);
