function insertTableRow() {

    if  (!checkInNumberRange(document.getElementById("dayField").value)) {
        return;
    }

    var tableMonth = document.getElementById("monthDropdown").value;

    var table = document.getElementById(tableMonth);

    var row = table.insertRow(-1);

    var nameCell = row.insertCell(0);
    var dateCell = row.insertCell(1);
    var amountCell = row.insertCell(2);
    var typeCell = row.insertCell(3);
    var removeCell = row.insertCell(4);

    nameCell.innerHTML = document.getElementById("nameField").value;
    dateCell.innerHTML = convertMonthToNumber(tableMonth) + "/" + document.getElementById("dayField").value;
    amountCell.innerHTML = "$" + document.getElementById("amountField").value;
    typeCell.innerHTML = document.getElementById("typeDropdown").value;
    removeCell.innerHTML = "<button type=\"button\" onclick=\"deleteTableRow(this)\" class=\'removeButton\'>Delete</button>";
}

function deleteTableRow(x) {
    var rowIndex = x.parentNode.parentNode;
    rowIndex.parentNode.removeChild(rowIndex);
}