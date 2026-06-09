let round = 0;

let t1, t2;
let frameTime = [];
let run = function () {
    t1 = Date.now();
    if (t2) {
        frameTime.push(t1 - t2);
    }
    t2 = Date.now();

    let ctx = tg.eventContext;
    let idx = Math.floor(Math.random() * 4);
    ctx.set("checked", !list.includes(industries[idx]));
    ctx.set("inputValue", industries[idx]);
    scene.onChange("evtContext", ctx);
    renderer.render(scene);
    
    if (round < 40) {
        round++;
        requestAnimFrame(run);
    } else {
        let t = d3.sum(frameTime) / frameTime.length,
            fr = 1000 / t;
        alert("average time to update a frame: " + t.toFixed(2) + " ms; frame rate: " + fr.toFixed(0));
    }
}
run();