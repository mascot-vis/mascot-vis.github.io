let c = scn.findElements([{property: "type", value: "collection"}])[0];
scn.sortChildren(c, "mascot_rowId");

let trigger = { target: "attr", event: "change" },
    responder = { component: c, properties: ["order"] },
    fn = (condMet, ctx, compnt) => {
        scn.sortChildren(compnt, ctx.get("inputValue"), compnt.sortBy.descending);
    };
let tg1 = scn.activate(trigger, responder, undefined, fn);

let trigger2 = { target: "dir", event: "change" },
    fn2 = (condMet, ctx, compnt) => {
        scn.sortChildren(compnt, compnt.sortBy.property, ctx.get("inputValue") === "descending" ? true : false);
    };
let tg2 = scn.activate(trigger2, responder, undefined, fn2);