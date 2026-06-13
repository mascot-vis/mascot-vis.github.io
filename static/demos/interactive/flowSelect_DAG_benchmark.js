let names = data.nodeTable.getUniqueAttributeValues("name"),
    elems = names.map(d => msc.findElements(scene, [{attribute: "name", value: d}, {property: "type", value: "text"}])[0]),
    count = 0,
    round = 0;

let t1, t2;
let frameTime = [];
let run = function () {
    t1 = Date.now();
    if (t2) {
        frameTime.push(t1 - t2);
    }
    t2 = Date.now();

    let ctx = tg1.eventContext;
    let elem = elems[count];
    ctx.set("element", elem);
    scene.onChange("evtContext", ctx);
    renderer.render(scene);

    if (count < names.length) {
        count++;
        requestAnimFrame(run);
    } else if (round < 10) {
        round++;
        count = 0;
        requestAnimFrame(run);
    } else {
        let t = d3.sum(frameTime)/frameTime.length,
            fr = 1000/t;
        alert("average time to update a frame: " + t.toFixed(2) + " ms; frame rate: " + fr.toFixed(0));
    }
}
run();