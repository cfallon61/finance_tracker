let mysql  = require("mysql");
let bcrypt = require("bcrypt");
let express = require("express");
let path    = require("path");
let sessions = require("client-sessions");

// config.json holds the credentials for the database and other important
// init settings
const init = require("./config.json");

var app = express();

// root directory
const root = path.join(__dirname, "./root");

const db = mysql.createConnection(init.db);

// connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to database");
    // just to verify that it connected to the DB, print to console
    db.query("SHOW TABLES", function(err, result)
    {
        if (err) throw err;
        console.log(result);
    })
});

// set the application to use the cookies specified in config.json
app.use(sessions(init.cookies));
app.use(express.static(root));

// start the server listening on port 8080
app.listen(8080, function(err)
{
    if (err) throw err;
    console.log("Server started");
});

// Get root file path
app.get('/', function(request, result)
{
    console.log("GET / " + request.headers + "\n");
    result.sendFile(path.join(root, "login.html"));
});

function login()
{

}

function onSubmit()
{
    document.getElementById('login');
    console.log("button clicked");
}

