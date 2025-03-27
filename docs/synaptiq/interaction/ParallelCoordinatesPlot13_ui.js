const link = document.createElement("a");
link.href = "https://d3-graph-gallery.com/graph/parallel_basic.html";
link.textContent = "Original Visualization (Made using D3)";
link.style.marginBottom = "15px";
link.style.display = "block";
link.target = "_blank";
document.getElementById("ctrlPanel").appendChild(link);


const info = document.createElement('div');
info.textContent = "Click and drag on an axis to start brushing; drag the brush to update the range of selection; click on an empty spot in an axis to remove brush. Multiple brushes can be created across the axes.";
document.getElementById("ctrlPanel").appendChild(info);
