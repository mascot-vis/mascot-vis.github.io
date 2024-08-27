function visualizeDepGraph(dg) {
    var g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(function() { return {}; });
    g.graph().rankdir = "LR";

    setupGraph(g, dg);
    dagre.layout(g);
    renderDepGraph(g);
}

function renderDepGraph(g) {
    document.getElementById("depGraphVis").style.visibility = "visible";
    let svg = d3.select("#depGraphVis");
    svg.selectAll("*").remove();

    svg.selectAll("path").data(g.edges()).enter().append("path")
        .attr("d", e => getPathData(g.node(e.v), g.edge(e).points, g.node(e.w))).style("stroke", "#ccc").style("fill", "none");
    
    svg.selectAll("rect").data(g.nodes()).enter().append("rect")
        .attr("x", d => g.node(d).x - g.node(d).width/2).attr("y", d => g.node(d).y - g.node(d).height/2)
        .attr("width", d => g.node(d).width).attr("height", d => g.node(d).height)
        .style("stroke", "#ccc").style("fill", d => g.node(d).type == "op" ? "yellow" : "white");
    
    svg.selectAll("text").data(g.nodes()).enter().append("text")
        .attr("x", d => g.node(d).x - g.node(d).width/2).attr("y", d => g.node(d).y + g.node(d).height/2).text(d => g.node(d).label);
    
    let bbox = svg.node().getBBox(),
        vb = [bbox.x - 10, bbox.y - 10, bbox.width + 20, bbox.height + 20];
    svg.attr("viewBox", vb.join(" "));
}

function getPathData(source, points, target) {
    let str = "M " + source.x + " " + source.y;
    //"M " + points[0].x + " " + points[0].y;
    for (let i = 0; i < points.length; i++)
        str += " L " + points[i].x + " " + points[i].y;
    str += " L " + target.x + " " + target.y;
    return str;
}

function setupGraph(g, dg) {
    let temp = d3.select("#depGraphVis").append("text");
    for (let varType in dg._variables) {
        for (let varId in dg._variables[varType]) {
            let v = dg._variables[varType][varId],
                label = v.channel ? v.channel : varType;
            label += v.element ?  ": " + v.element.type : "";
            temp.text(label);
            g.setNode(varId, {type: "var", label: label, width: temp.node().getBBox().width, height: temp.node().getBBox().height});
        }
    }

    for (let opType in dg._operators) {
        for (let opId in dg._operators[opType]) {
            let v = dg._operators[opType][opId],
                label = opType;
            temp.text(label);
            g.setNode(opId, {type: "op", label: label, width: temp.node().getBBox().width, height: temp.node().getBBox().height});
        }
    }

    for (let e of dg._edges) {
        g.setEdge(e.fromNode.id, e.toNode.id);
    }
}