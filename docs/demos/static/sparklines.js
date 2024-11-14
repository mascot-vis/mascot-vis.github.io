let scn = msc.scene({fillColor: "#222"});
let dt = await msc.csv("/datasets/csv/stocks.csv");
let dt2 = await msc.csv("/datasets/csv/stocks-March-2010.csv");
//dt.parseAttributeAsDate("date", "%b %Y");
let line = scn.mark("line", {x1: 300, y1: 100, x2: 450, y2: 150, strokeColor: "#ccc"});

let collection = scn.repeat(line, dt, {attribute: "company"});
collection.layout = msc.layout("grid", {numCols: 1, rowGap : 25});

let polyLine = scn.densify(line, dt, {attribute: "date"});

let xEnc = scn.encode(polyLine.firstVertex, {attribute: "date", channel: "x"});
let yEnc = scn.encode(polyLine.firstVertex, {attribute: "price", channel: "y", includeZero: true});

let symbol = scn.mark("text", {x: 220, y:100, fontSize: "23px", fillColor: "white", anchor: ["left", "top"]}),
    company = scn.mark("text", {x:220, y:125, fontSize: "15px", fillColor: "#888", anchor: ["left", "top"]});
let glyph = scn.glyph(symbol, company);
let coll = scn.repeat(glyph, dt2, {attribute: "company"});
scn.encode(symbol, {attribute: "symbol", channel: "text"});
scn.encode(company, {attribute: "company", channel: "text"});
scn.affix(glyph, polyLine, "y", {elementAnchor: "bottom", baseAnchor: "bottom"});

let price = scn.mark("text", {x: 470, y:100, fontSize: "20px", fillColor: "white", anchor: ["left", "top"]}),
    changeBg = scn.mark("rect", {left: 470, top: 125, width: 45, height: 20, strokeWidth: 0}),
    change = scn.mark("text", {x:475, y:125, fontSize: "15px", fillColor: "#bbb", anchor: ["left", "top"]});
let glyph2 = scn.glyph(price, changeBg, change);
scn.repeat(glyph2, dt2, {attribute: "company"});
scn.encode(price, {attribute: "price", channel: "text"});
scn.encode(change, {attribute: "change", channel: "text"});
let colorMapping = {"up": "green", "down": "red"};
scn.encode(changeBg, {attribute: "direction", channel: "fillColor", mapping: colorMapping});
scn.affix(glyph2, polyLine, "y", {elementAnchor: "bottom", baseAnchor: "bottom"});

// let r = msc.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: false});	