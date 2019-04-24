function checkInNumberRange(input) {

    var number = parseInt(input);

    return !(number > 32 || number < 0);
}


function convertMonthToNumber(month) {

    switch (month) {

        case "JANUARY":
            return 1;
        case "FEBRUARY":
            return 2;
        case "MARCH":
            return 3;
        case "APRIL":
            return 4;
        case "MAY":
            return 5;
        case "JUNE":
            return 6;
        case "JULY":
            return 7;
        case "AUGUST":
            return 8;
        case "SEPTEMBER":
            return 9;
        case "OCTOBER":
            return 10;
        case "NOVEMBER":
            return 11;
        case "DECEMBER":
            return 12;
        default:
            return -1;
    }
}

const monthmap =
  {
      "01": "JANUARY",
      "02": "FEBRUARY",
      "03": "MARCH",
      "04": "APRIL",
      "05": "MAY",
      "06": "JUNE",
      "07": "JULY",
      "08": "AUGUST",
      "09": "SEPTEMBER",
      "10": "OCTOBER",
      "11": "NOVEMBER",
      "12": "DECEMBER"
  };

function getMonthFromDate() {
    var date = document.getElementById("dateField").value.split("-");
    return date[1];
}

const specificsByTypes = {
    Deposit: ["Income", "Loan", "Gift"],
    Withdraw: ["Housing", "Utilities", "Insurance", "Food",
      "Recreation", "Recurring Bills", "Gas", "Gifts",
      "Health Care", "Personal Care", "Debt", "Other"]
};

function changeDropdown(value) {

    var options = "";

    for (categoryId in specificsByTypes[value]) {
        options += "<option>" + specificsByTypes[value][categoryId] + "</option>";
    }

    document.getElementById("specificDropdown").innerHTML = options;
}

function checkValidInput() {
  var input = document.getElementById("amountField");
  if (input.value === "") {
      return false;
  }

  input = document.getElementById("typeDropdown");
  if (input.value === ""){
      return false;
  }

  return true;
}

function getNumberFromDollarStr(str) {
    let substr = str.substr(1);
    return Number(substr);
}
