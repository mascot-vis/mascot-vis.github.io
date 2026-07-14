let scn = msc.scene();
let xPos = [100, 350, 600, 850], top = 80;
let path = scn.mark("path", {
	vertices: [[xPos[0], top], [xPos[1], top], [xPos[2], top], [xPos[3], top]],
	strokeColor: "#95D0F5",
	opacity: 0.15
} );
let dt = await msc.csv("/datasets/csv/cars.csv");

let paths = msc.repeat(path, dt);
let attributes = ["cylinders", "economy(mpg)", "displacement(cc)", "power(hp)"];
for (let i = 0; i < attributes.length; i++)
	msc.encode(path.vertices[i], "y", attributes[i], {rangeExtent: 400});
let enc = msc.encode(path, "strokeColor", "cylinders", {scheme: "interpolateBuPu"});
scn.legend("strokeColor", "cylinders", {x: 950, y: 100});
// msc.encode(path, {attribute: "year", channel: "strokeColor"});
// scn.legend("strokeColor", "year", {x: 950, y: 100});
for (let i = 0; i < attributes.length; i++)
	scn.axis("y", attributes[i], {orientation: "left", pathX: xPos[i], rotateTitle: false, titleOffset: 0});	
//, titleAnchor: ["center", "top"],  titlePosition: [xPos[i], top - 20]