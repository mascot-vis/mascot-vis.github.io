const link = document.createElement("a");
link.href = "https://www.anychart.com/products/anychart/gallery/Area_Charts/Stacked_Area_Chart.php";
link.textContent = "Original Visualization (Made using AnyChart)";
link.style.marginBottom = "15px";
link.style.display = "block";
link.target = "_blank";
document.getElementById("ctrlPanel").appendChild(link);

const info = document.createElement('div');
info.innerText = "Use the checkboxes to toggle the visibility of a region.";
info.style.marginBottom = "20px";
document.getElementById("ctrlPanel").appendChild(info);

const options = ['Americas', 'Europe', 'Greater China', 'Japan', 'Rest of Asia Pacific'];
const panel = document.getElementById("ctrlPanel");

options.forEach((option, index) => {
    // Create a checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox${index}`;
    checkbox.name = 'options';
    checkbox.value = option;
    checkbox.checked = true;

    // Create a label
    const label = document.createElement('label');
    label.htmlFor = `checkbox${index}`;
    label.textContent = option;

    // Append the checkbox and label to the DOM
    panel.appendChild(checkbox);
    panel.appendChild(label);

    // Add a line break for readability
    panel.appendChild(document.createElement('br'));
});