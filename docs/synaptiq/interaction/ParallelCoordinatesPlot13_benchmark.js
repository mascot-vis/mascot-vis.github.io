let y1Range = [200, 500], y2Range = [200, 570], round = 0, y1Ext = 5, y2Ext = 5;
let y1 = y1Range[0], y2 = y2Range[0];
let t1, t2;
let frameTime = [];

var run = function () {
    t1 = Date.now();
    if (t2) {
        frameTime.push(t1 - t2);
    }
    t2 = Date.now();

    let ctx = tgs[0].eventContext;
    ctx.set("yInterval", [y1, y1 + y1Ext]);
    scn.onChange("evtContext", ctx);

    if (tgs[1].eventContext.get("yInterval")) {
        tgs[1].eventContext.set("yInterval", [y2, y2 + y2Ext]);
        scn.onChange("evtContext", tgs[1].eventContext);
    }
    
    renderer.render(scn);

    if (y1 + y1Ext < y1Range[1]) {
        y1Ext += 2;
        requestAnimFrame(run);
    } else if (y2 + y2Ext < y2Range[1]) {
        if (!tgs[1].eventContext.get("yInterval"))
            tgs[1].eventContext.set("yInterval", [y2, y2 + y1Ext])
        y2Ext += 2;
        requestAnimFrame(run);
    } else if (round < 5) {
        y1 = y1Range[0], y2 = y2Range[0];
        y1Ext = 2;
        y2Ext = 2;
        tgs[1].eventContext.set("yInterval", undefined);
        round++;
        requestAnimFrame(run);
    } else {
        let t = d3.sum(frameTime)/frameTime.length,
            fr = 1000/t;
        alert("average time to update a frame: " + t.toFixed(2) + " ms; frame rate: " + fr.toFixed(0));
    }
}
run();