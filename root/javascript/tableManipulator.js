function insertTableRow() {

    if (!checkValidInput()) {
        return;
    }

    var monthFromDate = getMonthFromDate();

    var tableName = convertNumbertoMonth(monthFromDate);

    var table = document.getElementById(tableName);

    var row = table.insertRow(1);

    var idCell = row.insertCell(0);
    var dateCell = row.insertCell(1);
    var amountCell = row.insertCell(2);
    var typeCell = row.insertCell(3);
    var specificCell = row.insertCell(4);
    var removeCell = row.insertCell(5);

    var amount = document.getElementById("amountField").value;
    var type = document.getElementById("typeDropdown").value;

    dateCell.innerHTML = document.getElementById("dateField").value;

    if (type === "Withdrawal") {
        amount = amount * -1;
    }

    amountCell.innerHTML = "$" + amount;
    typeCell.innerHTML = type;
    specificCell.innerHTML = document.getElementById("specificDropdown").value;
    removeCell.innerHTML = "<button type=\"button\" onclick=\"deleteTableRow(this)\" class=\'removeButton\'>Delete</button>";

    updateTotal(table, amount);

    updateData();
    insert_to_db(dateCell.innerText, specificCell.innerText, amountCell.innerText, typeCell.innerText, idCell);
}

function parse_to_table(data)
{
    data.forEach((entry) =>
    {
        var row = table.insertRow(1);

        var idCell = row.insertCell(0);
        var dateCell = row.insertCell(1);
        var amountCell = row.insertCell(2);
        var typeCell = row.insertCell(3);
        var descCell = row.insertCell(4);
        var removeCell = row.insertCell(6);

        var amount = entry.AMOUNT;
        var type = entry.TRANS_TYPE;

        // TODO change this so it gets it from the DB
        idCell.innerHTML = entry.TRANS_ID;
        dateCell.innerHTML = entry.TRANS_DATE;

        if (type === "Withdrawal") {
            amount = amount * -1;
        }

        amountCell.innerHTML = "$" + amount;
        typeCell.innerHTML = type;
        descCell.innerHTML = entry.DESCRIPTION;
        removeCell.innerHTML = "<button type=\"button\" onclick=\"deleteTableRow(this)\" class=\'removeButton\'>Delete</button>";

    });
}

// function called when the page is loaded
function dump_user_data() {
    var json;
    let request = new XMLHttpRequest();
    const params = "?init_load=true&insert=false";
    const url = "/data" + params;
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // POST

    request.onreadystatechange = () =>
    {
        if (request.readyState === XMLHttpRequest.DONE)
        {
            if (request.status === 202)
            {
                // send to table parser
                json = JSON.parse(request.responseText);
                alert(json);
                // alert(json.length);
            }
            else alert(request.responseText);
        }
    };
    request.send(params);
    console.log(request);
    console.log("data dump");
    // do stuff with json
}

function insert_to_db(date, desc, amount, type, idCell)
{
  data = {
    TRANS_DATE: date,
    AMOUNT: getNumberFromDollarStr(amount),
    TRANS_DESCRIPTION: desc,
    TRANS_TYPE: type
  };

  let request = new XMLHttpRequest();
  const params = "?init_load=false&insert=true";
  const url = "/data" + params;

  request.open('POST', url, true);
  request.setRequestHeader("Content-type", 'application/json;charset=UTF-8');

  request.onreadystatechange = () =>
  {
    if (request.readyState === XMLHttpRequest.DONE)
    {
      if (request.status === 202)
      {
        // send to table parser
        alert(request.responseText);
        const json = JSON.parse(request.responseText);
        // idCell.innerHTML = json.TRANS_ID;
        alert(json);
      }
      else alert(request.responseText);
    }
  };

  request.send(JSON.stringify(data));
  console.log(request);
  console.log("insert");
}

// allows a user to delete an entry from the DB
function delete_from_db(trans_id)
{
    let request = new XMLHttpRequest();
    const params = "?trans_id=" + toString(trans_id);
    console.log(trans_id);
    const url = "/data" + params;
    request.open("DELETE", url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // POST

    request.onreadystatechange = () =>
    {
        if (request.readyState === XMLHttpRequest.DONE)
        {
            if (request.status === 202)
            {
                // send to table parser
                console.log(request.responseText);
            }
            else alert(request.responseText);
        }
    };
    request.send(params);
    console.log(request);
    console.log("delete", trans_id);
    // do stuff with json
}

function deleteTableRow(x) {
    var rowIndex = x.parentNode.parentNode;

    while (x && x.nodeName !== "TR") {
        x = x.parentNode;
    }

    var table = x.closest("table").id;
    table = document.getElementById(table);

    var data;
    var trans_id;

    if (x) {
        var cells = x.getElementsByTagName("td");

        data = cells[2].innerHTML;
        trans_id = parseInt(cells[0].innerText);
        data = data.substr(1);
    }

    rowIndex.parentNode.removeChild(rowIndex);
    delete_from_db(trans_id);

    data = "-" + data;
    updateTotal(table, data);
    updateData();
}

function updateTotal(table, amount) {

    var rowAmount = table.rows.length - 1;

    var oldTotalStr = table.rows[rowAmount].cells[1].innerHTML;

    if (oldTotalStr === "") {
        table.rows[rowAmount].cells[1].innerHTML = "$" + amount;
        return;
    }

    var oldTotalNumberStr = oldTotalStr.substr(1);

    var oldNumber = Number(oldTotalNumberStr);

    var newNumber = oldNumber + Number(amount);

    table.rows[rowAmount].cells[1].innerHTML = "$" + newNumber;
}
