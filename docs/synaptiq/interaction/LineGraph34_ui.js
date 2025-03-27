const link = document.createElement("a");
link.href = "https://aeturrell.github.io/coding-for-economists/vis-matplotlib.html";
link.textContent = "Original Visualization (Made using Matplotlib)";
link.style.marginBottom = "15px";
link.style.display = "block";
link.target = "_blank";
document.getElementById("ctrlPanel").appendChild(link);

const info = document.createElement('div');
info.innerText = "Hover over the chart to dynamically change the baseline date.";
info.style.marginBottom = "20px";
document.getElementById("ctrlPanel").appendChild(info);