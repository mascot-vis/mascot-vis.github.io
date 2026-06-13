let scn = msc.scene();
let data = await msc.csv("/datasets/csv/monthlySales.csv");

let ring = scn.mark("ring", {innerRadius: 50, outerRadius: 120, x: 400, y: 300, fillColor: "#1D90FF", strokeColor: "white"});
let {newMark:arc, collection:coll} = msc.divide(ring, data, {attribute: "Month"});

msc.encode(arc, {attribute: "Sales", channel: "thickness", rangeExtent: 150});

let text = scn.mark("text", {fillColor: "white", fontWeight: "bold", fontSize: "14px"});
msc.repeat(text, data, {attribute: "Month"});
msc.encode(text, {channel: "text", attribute: "Month"});

msc.affix(text, arc, "radialDistance", {elementAnchor: "top", baseAnchor: "top", offset: -10});
msc.affix(text, arc, "angle");