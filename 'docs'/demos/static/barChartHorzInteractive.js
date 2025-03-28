let scn = msc.scene();
let rect = scn.mark("rect", {top:60, left: 200, width: 350, height: 16, fillColor: "#84BC66", strokeWidth: 0} );
let dt = await msc.csv("/datasets/csv/GDP Change.csv");

let quarters = scn.repeat(rect, dt, {attribute: "Quarter"});
quarters.layout = msc.layout("grid", {numRows: 4, rowGap: 1});

let years = scn.repeat(quarters, dt, {attribute: "Year"});
years.layout = msc.layout("grid", {numCols: 1, rowGap: 16});

scn.encode(rect, {attribute: "% Change", channel: "width"});
scn.axis("y", "Quarter", {orientation: "left", tickVisible: false, pathVisible: false});
scn.axis("y", "Year", {orientation: "right", pathX: 370, labelFormat: "%Y", tickVisible: false, labelOffset: 220});
scn.axis("width", "% Change", {orientation: "bottom"});

let selDef = {"item": rect, "attribute": "Quarter", "remember": true},
    // hoverTargetDef = {"item": rect, "channel": "strokeWidth", "effect": {"selected": "1"}},
    hoverTargetDef = {"item": rect, "effect": {
                        "strokeWidth": {"selected": 2}, 
                        "strokeColor": {"selected": "orange"}
    }},
    // clickTargetDef = {"item": rect, "channel": "opacity", "effect": {"selected": "1.0", "unselected": 0.35}};
    clickTargetDef = {"item": rect, "effect": {
                        "opacity": {"selected": 1.0, "unselected": 0.35}
    }};

scn.addInteraction(rect, "hover", selDef, hoverTargetDef);
scn.addInteraction(rect, "click", selDef, clickTargetDef);
scn.addInteraction(scn, "click", {}, {"item": rect});