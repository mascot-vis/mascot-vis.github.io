const options = ['Manufacturing', 'Leisure and hospitality', 'Business services', 'Construction'];
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