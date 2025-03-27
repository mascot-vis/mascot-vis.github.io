//TODO: zoom in and zoom out
let curr = 0, incr = 1, count = 0;
let t1, t2;
let frameTime = [], collection = scn.findElements([{property: "type", value: "collection"}])[0];;

var run = function () {
    t1 = Date.now();
    if (t2) {
        frameTime.push(t1 - t2);
    }
    t2 = Date.now();

    let ctx = tg1.eventContext;
    if (curr === 10) {
        incr = -1;
    } else if (curr === -10) {
        incr = 1;
    }
    ctx.set("deltaX", incr);
    ctx.set("deltaY", incr);
    ctx.set("x", 400);
    ctx.set("y", 400);
    curr += incr;
    scn.onChange("evtContext", ctx);
    renderer.render(scn);

    if (count < 100) {
        count ++;
        requestAnimFrame(run);
    } else {
        let t = d3.sum(frameTime)/frameTime.length,
            fr = 1000/t;
        alert(collection.children.length + " elements; " + "average time to update a frame: " + t.toFixed(2) + " ms; frame rate: " + fr.toFixed(0));
    } 
}
run();