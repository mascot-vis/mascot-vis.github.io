let scn = msc.scene();
let dt = await msc.csv("datasets/csv/gdp-lifeExp.csv");
let circle = scn.mark("circle", { radius: 6, x: 60, y: 80, fillColor: "orange", strokeWidth: 0 });
let collection = msc.repeat(circle, dt, { attribute: "Country" });

msc.encode(circle, "x", "GDP per capita", { scaleType: "log" });
msc.encode(circle, "y", "Life expectancy");
msc.encode(circle, "fillColor", "Continent");

scn.axis("x", "GDP per capita", { orientation: "bottom", labelFormat: ".2s" });
scn.axis("y", "Life expectancy", { orientation: "left" });
scn.legend("fillColor", "Continent", { x: 400, y: 400 });
scn.gridlines("x", "GDP per capita");
scn.gridlines("y", "Life expectancy");

// Table headers
scn.mark("text", { text: "Country",         x: 650, y: 50, fontWeight: "bold" });
scn.mark("text", { text: "GDP per capita",  x: 750, y: 50, fontWeight: "bold" });
scn.mark("text", { text: "Life expectancy", x: 850, y: 50, fontWeight: "bold" });

// Derived table: on each brush, filters to the selected rows (up to 25)
let tableSpec = msc.transform("custom", (inTbl, outTbl, spec) => {
    let rows = spec.selectedRows ? spec.selectedRows.slice(0, 25) : inTbl.rows().slice(0, 25);
    outTbl.load(rows);
}, { selectedRows: null });

let tableDt = scn.derive(dt, tableSpec);

// Table rows bound to the derived table — repopulated automatically on brush
let countryCell = scn.mark("text", { text: "Country",         x: 650, y: 70 }),
    gdpCell     = scn.mark("text", { text: "GDP per capita",  x: 750, y: 70 }),
    lifeExpCell = scn.mark("text", { text: "Life expectancy", x: 850, y: 70 });
let row = scn.glyph(countryCell, gdpCell, lifeExpCell);
let tableRows = msc.repeat(row, tableDt);
msc.encode(countryCell,  "text", "Country");
msc.encode(gdpCell,      "text", "GDP per capita");
msc.encode(lifeExpCell,  "text", "Life expectancy");
tableRows.layout = msc.layout("grid", { numCols: 1, rowGap: 6 });

let trigger = { source: collection, event: "brush" },
    responder = { object: tableSpec, properties: ["selectedRows"] },
    updater = (evalResult, evtCtx, stateCtx, respObj) => {
        let sel = evtCtx.get("selectedRows");
        respObj.selectedRows = (sel && sel.length > 0) ? sel : null;
    };

// Brush → update tableSpec.selectedRows → transform reruns → table rows repopulate
msc.activate(trigger, responder, undefined, updater);

// Dim circles outside the brush selection
msc.activate(trigger,
    { object: circle, properties: ["fillColor", "opacity"] },
    (evtCtx, stateCtx, respObj) => {
        let xInt = evtCtx.get("xCoords"), yInt = evtCtx.get("yCoords");
        return (!xInt && !yInt) || (respObj.x >= xInt[0] && respObj.x <= xInt[1] && respObj.y >= yInt[0] && respObj.y <= yInt[1]);
    },
    (evalResult, evtCtx, stateCtx, respObj) => {
        if (!evalResult) {
            respObj.fillColor = '#eee';
            respObj.opacity = 0.5;
        }
    }
);

msc.renderer("svg", "svgElement").render(scn);
