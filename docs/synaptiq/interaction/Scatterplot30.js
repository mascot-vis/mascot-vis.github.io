let circle = scn.findElements([{property: "type", value: "circle"}])[0],
    xEncoding = scn.getEncoding('Horsepower', 'x'),
    xStart = xEncoding.getScale(circle).range[0],
    yEncoding = scn.getEncoding('Miles_per_Gallon', 'y'),
    yStart = yEncoding.getScale(circle).range[0];

let updater = (condMet, ctx, compnt) => {
    let attr = ctx.get("inputValue"), c = compnt.channel;
    let z = ["Miles_per_Gallon", "Displacement","Horsepower", "Acceleration"].includes(attr);
    scn.encode(circle, { attribute: attr, channel: c, rangeExtent: compnt.getRangeExtent(circle), includeZero: z, rangeStart: c === "x" ? xStart : yStart });
    scn.axis(c, attr);
    scn.gridlines(c, attr);
};

let xAttr = document.getElementById("x-attr");
let xTrigger = { event:"change", target: "x-attr" },
    xResponder = { component: xEncoding, properties: ["attribute"] };
let tg1 = scn.activate(xTrigger, xResponder, undefined, updater);

let yAttr = document.getElementById("y-attr");
let yTrigger = { event:"change", target: "y-attr" },
    yResponder = { component: yEncoding, properties: ["attribute"] };
let tg = scn.activate(yTrigger, yResponder, undefined, updater);