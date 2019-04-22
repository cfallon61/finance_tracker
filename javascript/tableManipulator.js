function insertTableRow() {

    var monthFromDate = getMonthFromDate();

    var tableName = convertNumbertoMonth(monthFromDate);

    var table = document.getElementById(tableName);

    var row = table.insertRow(1);

    var nameCell = row.insertCell(0);
    var dateCell = row.insertCell(1);
    var amountCell = row.insertCell(2);
    var typeCell = row.insertCell(3);
    var removeCell = row.insertCell(4);

    var amount = document.getElementById("amountField").value;
    var type = document.getElementById("typeDropdown").value;

    nameCell.innerHTML = document.getElementById("nameField").value;
    dateCell.innerHTML = document.getElementById("dateField").value;

    if (type == "Credit") {
        amount = amount * -1;
    }

    amountCell.innerHTML = "$" + amount;
    typeCell.innerHTML = type;
    removeCell.innerHTML = "<button type=\"button\" onclick=\"deleteTableRow(this)\" class=\'removeButton\'>Delete</button>";

    updateTotal(table, document.getElementById("amountField").value)
}

function deleteTableRow(x) {
    var rowIndex = x.parentNode.parentNode;
    rowIndex.parentNode.removeChild(rowIndex);
}

function updateTotal(table, amount) {

    var rowAmount = table.rows.length - 1;

    var oldTotalStr = table.rows[rowAmount].cells[1].innerHTML;

    if (oldTotalStr == ""){
        table.rows[rowAmount].cells[1].innerHTML = "$" + amount;
        return;
    }

    var oldTotalNumberStr = total.substr(1);

    var oldNumber = Number(oldTotalNumberStr);

    var newNumber = oldNumber + amount;

    table.rows[rowAmount].cells[1].innerHTML = "$" + newNumber;
}