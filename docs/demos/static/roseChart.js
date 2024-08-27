let scn = msc.scene({fillColor: "#FFFAFC"});
let circ = scn.mark("circle", {radius: 120, x: 400, y: 400, fillColor: "orange", strokeColor: "white"});
let data = await msc.csv("/datasets/csv/nightingale.csv");

// let rings = scn.divide(circ, data, {attribute: "Type", orientation: "radial"});
// let arcs = scn.divide(rings.firstChild, data, {attribute: "Month", orientation: "angular"});

let {newMark:pie, collection:pies} = scn.divide(circ, data, {attribute: "Month", orientation: "angular"});
let {newMark:arc, collection:arcs} = scn.divide(pie, data, {attribute: "Type", orientation: "radial"});

scn.encode(arc, {attribute: "Type", channel: "fillColor", mapping: {"Disease": "#CFDFE3", "Wounds": "#EBC3BE", "Other": "#77746F"}});
let enc = scn.encode(arc, {attribute: "Death", channel: "thickness", scaleType: "sqrt", rangeExtent: 200});
enc.rangeExtent = 190;
scn.legend("fillColor", "Type", {x: 150, y: 100});