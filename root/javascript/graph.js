
var lineData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

function createChart() {

    console.log("createChart()");

    var chart = document.getElementById("lineChart");

    let myChart = new Chart(chart, {
        type: 'line',
        data:  {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Budget Total',
                backgroundColor: 'rgb(34,169,255)',
                borderColor: 'rgb(21,141,255)',
                data: lineData
            }]
        },
    });
}

function updateData() {
    var table, totalCells, totalCell;

    
    var i;
    for (i = 0; i < 12; i++) {
        table = document.getElementById(months[i]);
        totalCells = table.rows.length - 1;
        totalCell = table.rows[totalCells].cells[1].innerHTML;
        lineData[i] = getNumberFromDollarStr(totalCell);
    }

    createChart();

}