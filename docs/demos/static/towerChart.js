let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/elections-2020.csv");
let bidenTbl = scn.derive(dt, msc.transform("filter", {attribute: "Biden_margin", type: "interval", value: [0, 100]})),
    trumpTbl = scn.derive(dt, msc.transform("filter", {attribute: "Trump_margin", type: "interval", value: [0, 100]}));
let rect = scn.mark("rect", {top: 60, left: 150, width: 350, height: 500, strokeColor: "white", fillColor: "#1E71B8"});
let {newMark:bidenRect, collection:bidenWins} = msc.divide(rect, bidenTbl, {orientation: "vertical", attribute: "State"});
let htEnc = msc.encode(bidenRect, "height", "Biden", {rangeExtent: 80});
let wdEnc = msc.encode(bidenRect, "width", "Biden_margin");
msc.sortChildren(bidenWins, "width");
msc.update(bidenWins.layout, {"horzCellAlignment": "right"});
let rect1 = scn.mark("rect", {top: 60, left: 400, width: 350, height: 500, strokeColor: "white", fillColor: "#CC1A59"});
let {newMark:trumpRect, collection:trumpWins} = msc.divide(rect1, trumpTbl, {orientation: "vertical", attribute: "State"});
msc.encode(trumpRect, "height", "Trump", {shareScale: htEnc});
msc.encode(trumpRect, "width", "Trump_margin", {shareScale: wdEnc});
msc.sortChildren(trumpWins, "width");
msc.align([bidenWins, trumpWins], "y", "bottom");
msc.affix(bidenWins, trumpWins, "x", {elementAnchor: "right", baseAnchor: "left"});
scn.axis("width", "Trump_margin", {orientation: "bottom", tickValues: [0, 10, 20, 30, 40]});
scn.axis("width", "Biden_margin", {orientation: "bottom", flip: true});

let winLine = scn.mark("line", {strokeWidth: 2, strokeColor: "orange"});    // horizontal
msc.affix(winLine, bidenWins, "y1", {baseAnchor: {value: 270, encoding: htEnc}});
msc.affix(winLine, bidenWins, "y2", {baseAnchor: {value: 270, encoding: htEnc}});
msc.affix(winLine, bidenWins, "x1", {baseAnchor: "left", offset: -20});
msc.affix(winLine, trumpWins, "x2", {baseAnchor: "right", offset: 20});

let winLabel = scn.mark("text", {text: "270 electoral votes to win", fontSize: "14px", fillColor: "#c87259"});
msc.affix(winLabel, trumpWins, "x", {elementAnchor: "right", baseAnchor: "right", offset: 20});
msc.affix(winLabel, bidenWins, "y", {elementAnchor: "bottom", baseAnchor: {value: 270, encoding: htEnc}, offset: -4});