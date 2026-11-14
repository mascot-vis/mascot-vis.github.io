let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/survey_response.csv");

let pie = scn.mark("circle", {
  x: 220,
  y: 180,
  radius: 70,
  fillColor: "#ddd",
  strokeColor: "#fff",
  strokeWidth: 1
});

let ageGroups = msc.repeat(pie, dt, {attribute: "Age Group"});
ageGroups.layout = msc.layout("grid", {
  numCols: 2,
  colGap: 120,
  rowGap: 110
});

let {newMark: responseSlice} = msc.divide(pie, dt, {
  attribute: "Response"
});

msc.encode(responseSlice, "angle", "Percentage", {
  aggregator: "sum",
  startAngle: 90,
  angleDirection: "clockwise"
});
msc.encode(responseSlice, "fillColor", "Response");

let labels = scn.mark("text", {
  fillColor: "#333",
  fontSize: "14px",
  fontWeight: "bold"
});
msc.repeat(labels, dt, {attribute: "Age Group"});
msc.encode(labels, "text", "Age Group");
msc.affix(labels, ageGroups, "x");
msc.affix(labels, ageGroups, "y", {offset: -95});

scn.legend("fillColor", "Response", {x: 650, y: 100});