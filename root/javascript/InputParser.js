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

function convertNumbertoMonth(number) {

    switch (number) {
        case "01":
            return "JANUARY";
        case "02":
            return "FEBRUARY";
        case "03":
            return "MARCH";
        case "04":
            return "APRIL";
        case "05":
            return "MAY";
        case "06":
            return "JUNE";
        case "07":
            return "JULY";
        case "08":
            return "AUGUST";
        case "09":
            return "SEPTEMBER";
        case "10":
            return "OCTOBER";
        case "11":
            return "NOVEMBER";
        case "12":
            return "DECEMBER";
        default:
            return "JANUARY";
    }
}

function getMonthFromDate() {

    var date = document.getElementById("dateField").value.split("-");

    return date[1];

}