let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/oecd_population_2018.csv");
let circle = scn.mark("circle", {radius: 80, x: 100, y: 50, fillColor: "orange", strokeWidth: 0});

let collection = scn.repeat(circle, dt, {attribute: "Country"});
scn.encode(circle, {attribute: "Population", channel: "area"});
collection.layout = msc.layout("packing", {x: 300, y: 300});

let text = scn.mark("text", {fillColor: "white"});
scn.repeat(text, dt);
scn.encode(text, {attribute: "Country", channel: "text"});
let enc = scn.encode(text, {attribute: "Population", channel: "fontSize", scaleType: "sqrt"});
enc.rangeExtent = 20;
scn.affix(text, circle, "x");
scn.affix(text, circle, "y");

scn.encode(circle, {attribute: "Continent", channel: "fillColor"});
scn.legend("fillColor", "Continent", {x: 550, y: 250});