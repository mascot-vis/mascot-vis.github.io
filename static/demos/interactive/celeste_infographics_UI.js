// const svg = document.createElement('svg');
// svg.id = "popup";
// svg.style.width = '960px';
// svg.style.height = "450px";
// svg.style.position = "fixed";
// svg.style.left = "230px";
// svg.style.top = "50px";
// svg.style.border = "1px solid #ddd";
// svg.style.background = "#fff"

// document.getElementById("ctrlPanel").appendChild(svg)

const popup = document.createElement("img");
popup.id = "popup";
popup.src = "demos/img/celeste/integrity_moreInfo.png"
popup.style.width = '859px';
popup.style.height = "487px";
popup.style.position = "fixed";
popup.style.left = "270px";
popup.style.top = "50px";
popup.style.border = "1px solid #aaa";
popup.style.visibility = "hidden";
document.getElementById("ctrlPanel").appendChild(popup)
