let scn = msc.scene();
let tree = await msc.treeJSON("/datasets/treejson/mascot_1.12.1.json");
let c = scn.mark("circle", {x: 400, y: 400, radius: 30, fillColor: "orange", strokeColor: "white"});
let coll = scn.stratify(c, tree, {size: 70});
scn.encode(coll.children[0], {attribute: "size", channel: "angle"});
scn.encode(coll.children[0], {attribute: "filetype", channel: "fillColor", scheme: "schemePaired"});
scn.legend("fillColor", "filetype", {x: 700, y: 100});

// let text = scn.mark("text", {fillColor: "black", fontWeight: "bold", fontSize: "12px"});
// scn.repeat(text, tree.nodeTable);
// scn.encode(text, {channel: "text", attribute: "event_attribute"});
// scn.affix(text, coll.firstChild, "radialDistance", {itemAnchor: "top", baseAnchor: "top", offset: -10});
// scn.affix(text, coll.firstChild, "angle");