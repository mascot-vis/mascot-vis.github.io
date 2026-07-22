let scene = msc.scene();
let rect = scene.mark("image", {x:200, y: 100, width: 20, height: 40, src: "/demos/img/human.png"});

let dt = await msc.csv("/datasets/csv/iconArray.csv");

let c = msc.repeat(rect, dt);
c.layout = msc.layout("grid", {numCols: 10});

msc.encode(rect, "src", "group", {mapping: {"Colored": "/demos/img/human.png", "Grey": "/demos/img/human-grey.png"}});
