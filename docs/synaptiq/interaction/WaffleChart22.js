let collection = scn.findElements([{property: "type", value: "collection"}])[0];

let trigger = { target: "my-spinner", event: "change" },
    responder = { component: collection.layout, properties: ["numRows"] },
    fn = (condMet, ctx, compnt) => {
        scn.setLayoutParameters(compnt.group, {"numRows": parseInt(ctx.get("inputValue"))})
    };

let tg1 = scn.activate(trigger, responder, undefined, fn);