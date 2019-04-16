let http   = require('http');
let mysql  = require("mysql");
let fs     = require("fs");
const init = require("./config.json");


const table_fields = [
    'FIRST',
    'LAST',
    'EMAIL',
    'PASS',
];

const db = mysql.createConnection(init);

// connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to database");
});

var values = ['Steve', '46'];
db.query("INSERT INTO test (name, age) VALUES ('Steve', '46')", function(err, result)
{
    console.log("inserting test info into db");
    if (err) throw err;
    console.log(result);
});


const server = http.createServer(function(request, response)
{
    // console.log(init);
    db.query("SELECT * FROM test;", function(err, result)
    {
       if (err) throw err;
       console.log(result);
    });

    response.writeHead(200, "OK", "Content-type: text/plain");
    response.write("Place holder login page");
    response.end();
}).listen(8080);


// server.on("connect", );

