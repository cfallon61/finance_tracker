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

    nameCell.innerHTML = document.getElementById("nameField").value;
    dateCell.innerHTML = convertMonthToNumber(tableMonth) + "/" + document.getElementById("dayField").value;
    amountCell.innerHTML = "$" + document.getElementById("amountField").value;
    typeCell.innerHTML = document.getElementById("typeDropdown").value;
}