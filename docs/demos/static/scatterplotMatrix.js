let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/iris.csv");
let attributes = ["sepal length","sepal width","petal length","petal width"];
// let attributes = ["sepal length","sepal width"];

let scatterplots = scn.composite();
// let fillScale = msc.createScale("ordinalColor");
// fillScale.domain = dt.unique("species");

let fillEnc;
for (let row of attributes) {
	for (let col of attributes) {
		let circle = scn.mark("circle", {radius: 6, x: 100, y: 80, fillColor: "orange", 
			strokeWidth: 0, opacity: 0.3});
		let sp = msc.repeat(circle, dt, {attribute: "id"});
		msc.encode(circle, "x", row, {rangeExtent: 135});
		msc.encode(circle, "y", col, {rangeExtent: 135});
		if (fillEnc)
			msc.encode(circle, "fillColor", "species", {shareScale: fillEnc});
		else
			fillEnc = msc.encode(circle, "fillColor", "species");
		scn.axis("x", row, {element: circle, titleOffset: 28});
		scn.axis("y", col, {element: circle, titleOffset: 28});
		scn.gridlines("x", row, {element: circle});
		scn.gridlines("y", col, {element: circle});
		scatterplots.addChild(sp);
	}
}

scn.setLayout(scatterplots, msc.layout("grid", {numCols: 4, colGap: 65, rowGap: 65}));
//scn.legend("fillColor", "species", {x: 920, y: 100});


// let r = msc.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: true});	