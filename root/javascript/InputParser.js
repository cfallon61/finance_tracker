function checkInNumberRange(input) {

    var number = parseInt(input);
    
    return !(number > 32 || number < 0);
}


function convertMonthToNumber(month) {

    switch (month) {

        case "January":
            return 1;
        case "February":
            return 2;
        case "March":
            return 3;
        case "April":
            return 4;
        case "May":
            return 5;
        case "June":
            return 6;
        case "July":
            return 7;
        case "August":
            return 8;
        case "September":
            return 9;
        case "October":
            return 10;
        case "November":
            return 11;
        case "December":
            return 12;
        default:
            return -1;
    }
}