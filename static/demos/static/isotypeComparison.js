let scene = msc.scene();

// ---- Title and legend ----
scene.mark("text", {x: 20, y: 30, text: "An unprecedented death toll in Qatar", fontSize: "1.7em", fontWeight: "bold", fillColor: "#222", anchor: ["left", "middle"]});
// Image marks position from their top-left corner (no anchor concept), so
// center the legend icon and its text on the same y (65) to align them as a row.
scene.mark("image", {x: 20, y: 48, width: 8, height: 16, src: "/demos/img/human-pink.png"});
scene.mark("text", {x: 36, y: 56, text: "= 1 worker death", fontSize: "0.9em", fontStyle: "italic", fillColor: "#555", anchor: ["left", "middle"]});

// ---- Six small comparison groups, structured like the Qatar block below ----
const comparisons = [
    {title: "London",       subtitle: "2012 Olympics",   count: 1},
    {title: "Vancouver",    subtitle: "2010 Olympics",   count: 1},
    {title: "South Africa", subtitle: "2010 World Cup",  count: 2},
    {title: "Brazil",       subtitle: "2014 World Cup",  count: 10},
    {title: "Sochi",        subtitle: "2014 Olympics",   count: 60},
    {title: "Beijing",      subtitle: "2008 Olympics",   count: 6},
];

// One row per worker death, tagged with its group's title/subtitle -- the
// same shape msc.repeat's group-counts helper builds internally, but built
// explicitly here so the title glyphs and the icon collection below can share
// one underlying table (msc.affix requires elem/base to come from the same table).
let comparisonRows = [];
for (let c of comparisons) {
    for (let i = 0; i < c.count; i++)
        comparisonRows.push({title: c.title, subtitle: c.subtitle});
}
let comparisonTbl = msc.table(comparisonRows);

// Title + subtitle as a repeated glyph: one glyph per distinct "title" value
// (6 groups), arranged in the same 3-column grid used for the Qatar blocks.
let titleText = scene.mark("text", {x: 20, y: 110, fontSize: "1.2em", fontWeight: "bold", fillColor: "#222", anchor: ["left", "top"]});
let subtitleText = scene.mark("text", {x: 20, y: 130, fontSize: "1em", fillColor: "#666", anchor: ["left", "top"]});
let titleGlyph = scene.glyph(titleText, subtitleText);
let titleGroup = msc.repeat(titleGlyph, comparisonTbl, {attribute: "title"});
msc.encode(titleText, "text", "title");
msc.encode(subtitleText, "text", "subtitle");
titleGroup.layout = msc.layout("grid", {numCols: 3, colGap: 40, rowGap: 70});

// Icons as a nested collection: one icon per worker death, classified into the
// six groups (each an inner 20-wide grid, same pattern as a Qatar block), with
// the six group-blocks arranged in the same 3-column grid as the titles above.
let comparisonIcon = scene.mark("image", {x: 20, y: 155, width: 8, height: 16, src: "/demos/img/human-pink.png"});
let comparisonGroup = msc.repeat(comparisonIcon, comparisonTbl);
msc.classify(comparisonGroup, {attribute: "title", layout: msc.layout("grid", {numCols: 20, colGap: 0, rowGap: 4})});
comparisonGroup.layout = msc.layout("grid", {numCols: 3, colGap: 40, rowGap: 30, vertCellAlignment: "top"});

// Keep each title glyph column-aligned with its (much wider) icon block --
// the icon grid's own auto-computed column pitch (~20 icons wide) is the one
// that has to stay put, so affix the narrower title glyphs to it rather than
// the reverse, and affix each corresponding pair individually (affixing the
// two collections as wholes would only apply one global shift, which lines up
// column 1 but drifts on columns 2/3 since the two grids' natural column
// pitches differ).
for (let i = 0; i < titleGroup.children.length; i++) {
    msc.affix(titleGroup.children[i], comparisonGroup.children[i], "x", {elementAnchor: "left", baseAnchor: "left"});
}

// ---- Qatar: the large icon array ----
scene.mark("text", {x: 20, y: 320, text: "Qatar", fontSize: "1.4em", fontWeight: "bold", fillColor: "#222", anchor: ["left", "middle"]});
scene.mark("text", {x: 20, y: 342, text: "Migrant worker deaths since Dec. 2010", fontSize: "1em", fillColor: "#555", anchor: ["left", "middle"]});

let qatarIcon = scene.mark("image", {x: 20, y: 355, width: 8, height: 16, src: "/demos/img/human-maroon.png"});

// 12 blocks of 100 icons each = 1200 worker deaths total.
let blockCounts = {};
for (let i = 1; i <= 12; i++) blockCounts["block" + i] = 100;
let qatarGroup = msc.repeat(qatarIcon, blockCounts);

// Each block: 100 icons arranged in a 20 x 5 grid.
msc.classify(qatarGroup, {attribute: "group", layout: msc.layout("grid", {numCols: 20, colGap: 0, rowGap: 4})});
qatarGroup.layout = msc.layout("grid", {numCols: 3, colGap: 40, rowGap: 20});

msc.renderer("svg", "svgElement").render(scene);
