let area = scn.findElements([{property: "type", value: "area"}])[0],
    regions = ['Americas', 'Europe', 'Greater China', 'Japan', 'Rest of Asia Pacific'],
    list = regions.slice();
let trigger = { target: ["checkbox0", "checkbox1", "checkbox2", "checkbox3", "checkbox4"], event: "change" },
    responder = { component: area, channels: ["visibility"] },
    evalFn =  (ctx, compnt) => {
        if (ctx.get("checked"))
            list.includes(ctx.get("inputValue")) || list.push(ctx.get("inputValue"));
        else
            list = list.filter(d => d !== ctx.get("inputValue"));
        return list.includes(compnt.dataScope.getAttrVal("Attribute"));
    },
    fn = (condMet, ctx, compnt) => {
        if (condMet) {
            scn.setProperties(compnt, { visibility: "visible"}, true);
        } else {
            scn.setProperties(compnt, { visibility: "hidden"}, true);
        }
    };

let tg = scn.activate(trigger, responder, evalFn, fn);