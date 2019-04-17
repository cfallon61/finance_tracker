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
app.get('/', function(request, response)
{
    console.log("GET / " + request.headers + "\n");
    response.sendFile(path.join(root, 'index.html'));
});

app.get('/login', function(request, response)
{
    console.log("GET /login " + request.headers);
    response.sendFile(path.join(root, "login.html"));
});

// the user's dashboard
app.post('/dashboard/:uid', is_logged_in, function(request, response)
{
    var uid = request.session.user;
    var query_string = "SELECT * FROM " + uid;
    db.query(query_string, function(err, response)
    {
        if (err) throw err;
        console.log(response);
    });
});


// check if the user is logged into an account
function is_logged_in(request, response, next)
{
    var loggedin = request.session.user;
    // if the user is not logged in redirect them to the login page
    if (!loggedin)
    {
        request.session.reset();
        response.redirect("/login");
    }
    // do the next function
    else next();
}

