let scn = msc.scene();
let dt = await msc.csv("datasets/csv/gdp-lifeExp.csv");
let circle = scn.mark("circle", { radius: 6, x: 100, y: 80, fillColor: "orange", strokeWidth: 0 });
let collection = msc.repeat(circle, dt, { attribute: "Country" });

// //Country,GDP per capita,Life expectancy,Population,Continent
let xEncoding = msc.encode(circle, { attribute: "GDP per capita", channel: "x" });
let yEncoding = msc.encode(circle, { attribute: "Life expectancy", channel: "y" });
let fillEncoding = msc.encode(circle, { attribute: "Continent", channel: "fillColor" });

scn.axis("x", "GDP per capita", { orientation: "bottom", labelFormat: ".2s" });
xEncoding.rangeExtent = 700;
scn.axis("y", "Life expectancy", { orientation: "left", labelFormat: ".2s" });

let legend = scn.legend("fillColor", "Continent", { x: 850, y: 150 });
scn.gridlines("x", "GDP per capita");
scn.gridlines("y", "Life expectancy");

let updater = (condMet, ctx, compnt) => {
    let attr = ctx.get("inputValue");
    compnt.attribute = attr;
};

let xAttr = document.getElementById("x-attr");
let xTrigger = { event:"change", target: "x-attr" },
    xResponder = { component: xEncoding, properties: ["attribute"] };
let tg1 = msc.activate(xTrigger, xResponder, undefined, updater);

let yAttr = document.getElementById("y-attr");
let yTrigger = { event:"change", target: "y-attr" },
    yResponder = { component: yEncoding, properties: ["attribute"] };
let tg2 = msc.activate(yTrigger, yResponder, undefined, updater);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);