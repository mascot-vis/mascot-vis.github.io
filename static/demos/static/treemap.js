let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/oecd_population_2018.csv");
let rect = scn.mark("rect", {top: 60, left: 50, width: 600, height: 800, strokeWidth: 1});

let {newMark: continent, collection: continents} = scn.divide(rect, dt, {attribute: "Continent", orientation: "vertical"});
let {newMark:country, collection: countries} = scn.divide(continent, dt, {attribute: "Country", orientation: "horizontal"});
scn.encode(country, {attribute: "Population", channel: "area"});
scn.setLayout(continents, msc.layout("treemap", {width: 800, height: 500}));
scn.encode(country, {attribute: "Continent", channel: "fillColor"});
scn.legend("fillColor", "Continent", {x: 900, y:100});