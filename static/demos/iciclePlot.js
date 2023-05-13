let scene = msc.scene();
// let tree = await msc.treejson("datasets/treejson/emergency_unit.json");
let tree = await msc.treejson("datasets/treejson/PediatricUnit-coreflow_msp0.05.json");
let rect = scene.mark("rect", {left: 100, top: 100, width: 400, height: 30, fillColor: "orange", strokeColor: "white"});
scene.stratify(rect, tree, {size: 80});
let wdEnc = scene.encode(rect, {channel: "width", field: "value"});
//let colorMapping = {"Start": "#aaa", "Arrival": "#EE8636", "Emergency": "#D57DBE", "ICU": "#C43932", "Pass Away": "#84584E", "Floor": "#3B75AF", "Discharge-Alive": "#519E3E"}
let colorMapping = {"Start": "#aaa", "breathing": "#EE8636", "pulse": "#D57DBE", "pupil": "#C43932", "blanket": "#84584E", "temp": "#3B75AF", "iv": "#519E3E"}
scene.encode(rect, {field: "event", channel: "fillColor", mapping: colorMapping});
let text = scene.mark("text", {fillColor: "#fff", fontWeight: "bold", fontSize: "12px"});
scene.repeat(text, tree.nodeTable);
scene.encode(text, {channel: "text", field: "event"});
scene.affix(text, rect, "x");
scene.affix(text, rect, "y");
scene.axis("width", "value", {"orientation": "top", "y": 100, "showTitle": false, "pathVisible": false});
scene.find([{field: "event", values: ["Exit"]}]).forEach(d => d.visibility = "hidden");
