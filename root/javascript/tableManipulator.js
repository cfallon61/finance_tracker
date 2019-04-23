function insertTableRow() {

    var monthFromDate = getMonthFromDate();

    var tableName = convertNumbertoMonth(monthFromDate);

    var table = document.getElementById(tableName);

    var row = table.insertRow(1);

    var nameCell = row.insertCell(0);
    var dateCell = row.insertCell(1);
    var amountCell = row.insertCell(2);
    var typeCell = row.insertCell(3);
    var specificCell = row.insertCell(4);
    var descriptionCell = row.insertCell(5);
    var removeCell = row.insertCell(6);

    var amount = document.getElementById("amountField").value;
    var type = document.getElementById("typeDropdown").value;

    nameCell.innerHTML = document.getElementById("nameField").value;
    dateCell.innerHTML = document.getElementById("dateField").value;

    if (type === "Credit") {
        amount = amount * -1;
    }

    amountCell.innerHTML = "$" + amount;
    typeCell.innerHTML = type;
    specificCell.innerHTML = document.getElementById("specificDropdown").value;
    descriptionCell.innerHTML = document.getElementById("desc").value;
    removeCell.innerHTML = "<button type=\"button\" onclick=\"deleteTableRow(this)\" class=\'removeButton\'>Delete</button>";

    updateTotal(table, amount)
}

function deleteTableRow(x) {
    var rowIndex = x.parentNode.parentNode;

    while (x && x.nodeName !== "TR") {
        x = x.parentNode;
    }

    var table = x.closest("table").id;
    table = document.getElementById(table);

    var data;

    if (x) {
        var cells = x.getElementsByTagName("td");

        data = cells[2].innerHTML;

        data = data.substr(1);
    }

    rowIndex.parentNode.removeChild(rowIndex);

    //TODO: Implement update total upon removal
    updateTotal(table, data);
}

function updateTotal(table, amount) {

    var rowAmount = table.rows.length - 1;

    var oldTotalStr = table.rows[rowAmount].cells[1].innerHTML;

    if (oldTotalStr === ""){
        table.rows[rowAmount].cells[1].innerHTML = "$" + amount;
        return;
    }

    var oldTotalNumberStr = oldTotalStr.substr(1);

    var oldNumber = Number(oldTotalNumberStr);

    var newNumber = oldNumber + Number(amount);

    table.rows[rowAmount].cells[1].innerHTML = "$" + newNumber;
}