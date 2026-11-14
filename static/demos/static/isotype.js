let scene = msc.scene({fillColor: "#ECE9E0"});
let dt = await msc.csv("/datasets/csv/waffle.csv");

let rect = scene.mark("image", {x:200, y: 100, width: 20, height: 40, src: "/demos/img/age-26-34.png"});
let c = msc.repeat(rect, dt);
msc.encode(rect, "src", "Age Bin", {mapping: {
    "Teenager 13-18": "/demos/img/age-teenager.png",
    "Adult 19-25": "/demos/img/age-19-25.png",
    "Adult 26-34": "/demos/img/age-26-34.png",
    "Adult 35-54": "/demos/img/age-35-54.png",
    "Adult 55-64": "/demos/img/age-55-64.png",
    "Senior 65+": "/demos/img/age-65-plus.png"
}});
msc.classify(c, {attribute: "Age Bin", layout: msc.layout("grid", {numCols: 15, rowGap: 5, colGap: 5})});
c.layout = msc.layout("stack", {orientation: "vertical", gap: 30});
scene.axis("y", "Age Bin", {orientation: "left", tickVisible: false, pathVisible: false, titleVisible: false});