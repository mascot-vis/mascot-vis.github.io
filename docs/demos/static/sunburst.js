let scn = msc.scene();
let tree = await msc.treeJSON("/datasets/treejson/mascot_1.12.1.json");
let c = scn.mark("circle", {x: 400, y: 400, radius: 30, fillColor: "orange", strokeColor: "white"});
let coll = msc.stratify(c, tree, {size: 70});
msc.encode(coll.children[0], "angle", "size");
msc.encode(coll.children[0], "fillColor", "filetype", {scheme: "schemePaired"});
scn.legend("fillColor", "filetype", {x: 700, y: 100});

// let text = scn.mark("text", {fillColor: "black", fontWeight: "bold", fontSize: "12px"});
// msc.repeat(text, tree.nodeTable);
// msc.encode(text, {channel: "text", attribute: "event_attribute"});
// msc.affix(text, coll.firstChild, "radialDistance", {itemAnchor: "top", baseAnchor: "top", offset: -10});
// msc.affix(text, coll.firstChild, "angle");