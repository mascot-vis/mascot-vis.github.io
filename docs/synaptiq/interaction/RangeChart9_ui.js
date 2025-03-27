const link = document.createElement("a");
link.href = "https://docs.anychart.com/Basic_Charts/Range_Bar_Chart";
link.textContent = "Original Visualization (Made using AnyChart)";
link.style.marginBottom = "15px";
link.style.display = "block";
link.target = "_blank";
document.getElementById("ctrlPanel").appendChild(link);

const info = document.createElement('div');
info.innerText = "Click and drag any x-axis label or tick to change the range extent.";
document.getElementById("ctrlPanel").appendChild(info);