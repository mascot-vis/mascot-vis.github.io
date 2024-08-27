let scn = msc.scene();
let data = await msc.csv("/datasets/csv/monthlySales.csv");

let ring = scn.mark("ring", {innerRadius: 50, outerRadius: 120, x: 400, y: 300, fillColor: "#1D90FF", strokeColor: "white"});
let {newMark:arc, collection:coll} = scn.divide(ring, data, {attribute: "Month"});

scn.encode(arc, {attribute: "Sales", channel: "thickness", rangeExtent: 150});

let text = scn.mark("text", {fillColor: "white", fontWeight: "bold", fontSize: "14px"});
scn.repeat(text, data, {attribute: "Month"});
scn.encode(text, {channel: "text", attribute: "Month"});

scn.affix(text, arc, "radialDistance", {elementAnchor: "top", baseAnchor: "top", offset: -10});
scn.affix(text, arc, "angle");