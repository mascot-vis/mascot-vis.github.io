let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/gdp-lifeExp.csv");
let circle = scn.mark("circle", {radius: 6, x: 100, y: 80, fillColor: "orange", strokeWidth: 0});

let collection = msc.repeat(circle, dt, { attribute: "Country" });

//Country,GDP per capita,Life expectancy,Population,Continent
let xEncoding = msc.encode(circle, { attribute: "GDP per capita", channel: "x" });
let yEncoding = msc.encode(circle, { attribute: "Life expectancy", channel: "y" });
let fillEncoding = msc.encode(circle, { attribute: "Continent", channel: "fillColor" });

xEncoding.rangeExtent = 450;
yEncoding.rangeExtent = 450;

msc.update(circle, { opacity: "0.7" });
//yEncoding.includeZero = true;
scn.axis("x", "GDP per capita", { orientation: "bottom", labelFormat: ".2s" });
scn.axis("y", "Life expectancy", { orientation: "left" });
let legend = scn.legend("fillColor", "Continent", { x: 600, y: 250 });
scn.gridlines("x", "GDP per capita");
scn.gridlines("y", "Life expectancy");
