const link = document.createElement("a");
link.href = "https://insights.datylon.com/stories/qS11V4CyLM1etV1Q925FOg";
link.textContent = "Original Visualization (Made using Datylon)";
link.style.marginBottom = "15px";
link.style.display = "block";
link.target = "_blank";
document.getElementById("ctrlPanel").appendChild(link);

const info = document.createElement('div');
info.innerText = "Scroll or pinch to zoom in and out; click and drag to pan. Note that the y-axis is in log scale.";
document.getElementById("ctrlPanel").appendChild(info);