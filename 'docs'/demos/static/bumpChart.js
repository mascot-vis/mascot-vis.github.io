let scn = msc.scene({fillColor: "#333"});
let line = scn.mark("line", {x1: 100, y1: 100, x2: 700, y2: 400, strokeColor: "green", vxShape: "circle", vxRadius: 4});
let dt = await msc.csv("/datasets/csv/newCarColors.csv");

// let coll = scn.repeat(line, dt, {attribute: "Color", layout: msc.layout("grid", {"numCols": 1})});
scn.repeat(line, dt, {attribute: "Color"});
line = scn.densify(line, dt, {attribute: "Year"});
scn.setProperties(line, {curveMode: "bumpX"});
let vertex = line.vertices[0];
scn.encode(vertex, {attribute: "Year", channel:"x"});
scn.encode(vertex, {attribute: "Rank", channel:"y", flipScale: true});
scn.axis("x", "Year", {orientation: "bottom", pathY: 420, labelFormat: "%Y", strokeColor: "#ccc", textColor: "#ccc"});
scn.axis("y", "Rank", {orientation: "left", pathX: 80, strokeColor: "#ccc", textColor: "#ccc"});
// // scn.setProperties(coll, {"layout": undefined});
let colorMapping = {"White (solid+pearl)": "#eee", "Red": "red", "Gold/yellow": "#c9b037", "Silver": "silver", "Green": "green", "Brown/beige": "brown", "Blue": "blue", "Black (solid+effect)": "black", "Other": "magenta", "Gray": "gray"}
scn.encode(line, {attribute: "Color", channel:"strokeColor", mapping: colorMapping});
scn.legend("strokeColor", "Color", {x: 760, y: 100, textColor: "#ccc"});



