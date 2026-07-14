let scn = msc.scene({fillColor: "#FFFAFC"});
let circ = scn.mark("circle", {radius: 120, x: 400, y: 400, fillColor: "orange", strokeColor: "white"});
let data = await msc.csv("/datasets/csv/nightingale.csv");

// let rings = msc.divide(circ, data, {attribute: "Type", orientation: "radial"});
// let arcs = msc.divide(rings.firstChild, data, {attribute: "Month", orientation: "angular"});

let {newMark:pie, collection:pies} = msc.divide(circ, data, {attribute: "Month", orientation: "angular"});
let {newMark:arc, collection:arcs} = msc.divide(pie, data, {attribute: "Type", orientation: "radial"});

msc.encode(arc, "fillColor", "Type", {mapping: {"Disease": "#CFDFE3", "Wounds": "#EBC3BE", "Other": "#77746F"}});
let enc = msc.encode(arc, "thickness", "Death", {scaleType: "sqrt", rangeExtent: 200});
enc.rangeExtent = 190;
scn.legend("fillColor", "Type", {x: 150, y: 100});