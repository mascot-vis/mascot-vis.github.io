let scene = atlas.scene();
let tree = await atlas.treejson("treejson/emergency_unit.json");
let rect = scene.mark("rect", {left: 100, top: 100, width: 800, height: 30, fillColor: "orange", strokeColor: "white"});
scene.stratify(rect, tree, {size: 50});
let wdEnc = scene.encode(rect, {channel: "width", field: "value"});
let colorMapping = {"Start": "#aaa", "Arrival": "#EE8636", "Emergency": "#D57DBE", "ICU": "#C43932", "Pass Away": "#84584E", "Floor": "#3B75AF", "Discharge-Alive": "#519E3E"}
scene.encode(rect, {field: "event", channel: "fillColor", mapping: colorMapping});
let text = scene.mark("text", {fillColor: "#fff", fontWeight: "bold", fontSize: "12px"});
scene.repeat(text, tree.nodeTable);
scene.encode(text, {channel: "text", field: "event"});
scene.affix(text, rect, "x");
scene.affix(text, rect, "y");
scene.axis("width", "value", {"orientation": "top", "y": 100, "showTitle": false, "pathVisible": false});
