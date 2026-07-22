let scene = msc.scene();
let rect = scene.mark("image", {x:200, y: 100, width: 40, height: 80, src: "/demos/img/star.png"});

let c = msc.repeat(rect, {colored: 34, gray: 46});
c.layout = msc.layout("grid", {numCols: 10, colGap: -4, rowGap: -48, rowOffset: 18});

msc.encode(rect, "src", "group", {mapping: {colored: "/demos/img/star.png", gray: "/demos/img/star-grey.png"}});
