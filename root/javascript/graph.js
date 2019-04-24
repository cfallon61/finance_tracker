
var lineData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
var pieDataW = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
var pieDataD = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];

//line chart
function createChart() {

    console.log("createChart()");

    var chart = document.getElementById("lineChart");

    let myChart = new Chart(chart, {
        type: 'line',
        data:  {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Budget Total',
                backgroundColor: "#A0977E",
                borderColor: "#474338",
                fontColor: "#474338",
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
    updateWithdrawData();
    updateDepositData();

}

//withdraw pie chart
function createWithdrawPieChart() {

    console.log("createChart()");
    var i;
    for (i = 0; i < 12; i++){
        var chartID = "pieChart" + months[i];
        console.log(chartID);
        var chart = document.getElementById(chartID);
        if(window.bar !== undefined) window.bar.destroy();
        let myChart = new Chart(chart, {
            type: 'doughnut',
            data:  {
                labels: ['Home', 'Utilities', 'Upkeep', 'Debt Repayment', 'Recreation'],
                datasets: [{
                    label: 'Monthly Withdraws',
                    backgroundColor: ["#A0977E", "#726C5A", "#474338", "#282620", "#161512"],
                    cutoutPercentage: 50,
                    fontColor: "#474338",
                    data: pieDataW[i]
                }]
            },
        });
    }
}

function updateWithdrawData() {
    var table;
    var i;
    var j;
    pieDataW = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
    // alert("creating withdraw chart");
    for (i = 0; i < 12; i++){
        table = document.getElementById(months[i]);

        if (table == null) return;

        for (j = 1; j < table.rows.length-1; j++)
        {
            console.log(j);
            let typeCell = table.rows[j].cells[3].innerHTML;
            console.log(typeCell);
            if (typeCell === "Deposit") continue;
            typeCell = table.rows[j].cells[4].innerHTML;
            let amount = getNumberFromDollarStr(table.rows[j].cells[2].innerText);

            amount = Math.abs(amount);

            console.log(typeCell);
            if(typeCell === "Home"){
                console.log("Adding Home Expense");
                pieDataW[i][0] += amount;
            }
            else if(typeCell === "Utilities"){
                console.log("Adding Utilities Expense");
                pieDataW[i][1] += amount;
            }
            else if(typeCell === "Upkeep") {
                console.log("Adding Upkeep Expense");
                pieDataW[i][2] += amount;
            }
            else if(typeCell === "Debt Payments") {
                console.log("Adding Debt Repayment Expense");
                pieDataW[i][3] += amount;
            }
            else if(typeCell === "Recreation") {
                console.log("Adding Recreation Expense");
                pieDataW[i][4] += amount;
            }

            console.log(pieDataW);
        }
    }
    createWithdrawPieChart();
}

//deposit pie chart
function createDepositPieChart() {
    console.log("createChart()");
    var i;
    for (i = 0; i < 12; i++){
        var chartID = "depositPieChart" + months[i];
        console.log(chartID);
        var chart = document.getElementById(chartID);
        if(window.bar !== undefined) window.bar.destroy();
        let myChart = new Chart(chart, {
            type: 'doughnut',
            data:  {
                labels: ['Loan', 'Income'],
                datasets: [{
                    label: 'Monthly Deposits',
                    backgroundColor: ["#726C5A", "#282620"],
                    cutoutPercentage: 50,
                    fontColor: "#474338",
                    data: pieDataD[i]
                }]
            },
        });
    }
}

function updateDepositData() {
    var table;
    var i;
    var j;
    pieDataD = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
    for (i = 0; i < 12; i++){
        table = document.getElementById(months[i]);
        if (table == null) return;
        for (j = 1; j < table.rows.length-1; j++) {
            console.log(j);
            let typeCell = table.rows[j].cells[3].innerHTML;
            console.log(typeCell);
            if (typeCell === "Withdraw") continue;
            typeCell = table.rows[j].cells[4].innerHTML;
            let amount = getNumberFromDollarStr(table.rows[j].cells[2].innerText);
            amount = Math.abs(amount);
            console.log(typeCell);
            if(typeCell === "Loan"){
                console.log("Adding Home Expense");
                pieDataD[i][0] += amount;
            }
            else if(typeCell === "Income"){
                console.log("Adding Utilities Expense");
                pieDataD[i][1] += amount;
            }

            console.log(pieDataD);
        }
    }
    createDepositPieChart();
}