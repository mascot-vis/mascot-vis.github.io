let scene = msc.scene();
let tree = await msc.treejson("datasets/treejson/mascot_1.12.1.json");
let rect = scene.mark("rect", {left: 100, top: 100, width: 800, height: 30, fillColor: "#B3DAFF", strokeColor: "white"});
scene.stratify(rect, tree, {size: 80});
let wdEnc = scene.encode(rect, {channel: "width", field: "size"});
//let colorMapping = {"Start": "#aaa", "Arrival": "#EE8636", "Emergency": "#D57DBE", "ICU": "#C43932", "Pass Away": "#84584E", "Floor": "#3B75AF", "Discharge-Alive": "#519E3E"}
//let colorMapping = {"Start": "#aaa", "breathing": "#EE8636", "pulse": "#D57DBE", "pupil": "#C43932", "blanket": "#84584E", "temp": "#3B75AF", "iv": "#519E3E"}
scene.encode(rect, {field: "filetype", channel: "fillColor", scheme: "schemeSet3"});
let text = scene.mark("text", {fillColor: "#003366", fontWeight: "bold", fontSize: "12px", visibility: "hidden"});
scene.repeat(text, tree.nodeTable);
scene.encode(text, {channel: "text", field: "name"});
scene.affix(text, rect, "x");
scene.affix(text, rect, "y");
let visibleLabels = ['Mascot', 'dist', 'demos', 'src', 'datasets', 'csv', 'lib', 'thumbnails'];
//scene.axis("width", "size", {"orientation": "top", "y": 100, "showTitle": false, "pathVisible": false, "labelFormat": ".2s"});
scene.find([{field: "name", values: visibleLabels}, {channel: "type", values: ["pointText"]}]).forEach(d => d.visibility = "visible");
scene.legend("fillColor", "filetype", {x: 140, y: 500, "orientation": "horizontal"});
