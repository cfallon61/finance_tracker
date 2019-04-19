let mysql  = require("mysql");
let bcrypt = require("bcrypt");
let express = require("express");
let path    = require("path");
let sessions = require("client-sessions");

// config.json holds the credentials for the database and other important
// init settings
const init = require("./config.json");
const create_user_str = "(ID AUTO_INCREMENT PRIMARY KEY, " +
    "TRANS_DATE DATE, " +
    "AMOUNT FLOAT, " +
    "TYPE VARCHAR(15), " +      // deposit or deduction
    "DESCRIPTION VARCHAR(255)"; // what type of transaction it was. Client will have drop down

const app = express();

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
    });
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
    console.log(request.finance_tracker);
    response.sendFile(path.join(root, 'index.html'));
});

// user has submitted the login information
app.post('/login', not_logged_in, (request, response) =>
{
    console.log("POST /login " + request.headers);
    var username = {};//placeholder
    var password = {}; //placeholder
    var query_string = "SELECT * FROM USERS WHERE USERNAME='" + username +"'";
    var query_res;
    // query db for user info
    db.query(query_string, (err, res)=>
    {
        if (err) console.log(err);
        console.log(res);
        query_res = res;
    });
});

// user has submitted the login information
app.post('/signup', not_logged_in, (request, response) =>
{
    console.log("POST /login " + request.headers);
    var username = {};//placeholder
    var password = {}; //placeholder
    var query_string = "SELECT * FROM USERS WHERE USERNAME='" + username +"'";
    var query_res;
    // query db for user info
    db.query(query_string, (err, res)=>
    {
        if (err) {
            console.log("Error");
        }
        console.log(res);
        query_res = res;
    });
    // if the user exists reply back that they exist
    if (query_res)
    {
        // placeholder function
        response.send("User already exists. Pick a different username or try logging in");
    }
    // user does not exist, so make a new table for them
    else
    {
        query_string = "CREATE TABLE " + username + " " + create_user_str;
        db.query(query_string, (err, res) =>
        {
            if (err) console.log(err);
            console.log(res);
        })
    }
});

// the user's dashboard
app.get('/dashboard', is_logged_in, (request, response) =>
{
    var username = request.finance_tracker.username;
    var query_string = "SELECT * FROM " + username;
    db.query(query_string, function(err, response)
    {
        if (err) throw err;
        console.log(response);
    });
});


// check if the user is logged into an account
function is_logged_in(request, response, next)
{
    console.log("verifying login");
    var username = request.finance_tracker.username;
    // console.log(loggedin);
    // if the user is not logged in redirect them to the login page
    if (!username)
    {
        request.finance_tracker.reset();
        response.redirect("/login");
    }
    // do the next function
    else next();
}

function not_logged_in(req, res, next)
{
    console.log('verifying user is not logged in');
    // console.log(req.finance_tracker.user);
    if (!req.finance_tracker.username)
    {
        next();
    }
    else
    {
        res.redirect("/dashboard");
    }

}

