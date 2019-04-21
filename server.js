let mysql  = require("mysql");
let bcrypt = require("bcrypt");
let express = require("express");
let path    = require("path");
let sessions = require("express-session");

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
    console.log("GET / ");
    console.log(request.headers);
    console.log(request.session);
    response.sendFile(path.join(root, 'index.html'));
});

// user has submitted the login information
app.post('/login', not_logged_in, (request, response) =>
{
    console.log("\n\nPOST /login ");
    // console.log(request.headers);
    console.log(request.session);

    var username = request.session.username;
    var password = request.session.password;
    var query_string = "SELECT * FROM USERS WHERE USERNAME=?";
    var query_res;

    console.log("Username: " + username + " | Password: " + password);
    if (!username || !password)
    {
        response.sendStatus(401);
        return;
    }
    // query db for user info
    db.query(query_string, username,(err, res)=>
    {
        if (err) console.log(err);
        console.log(res);
        query_res = res;
    });
    // if the response is empty, user doesn't exist
    if (!query_res)
    {
        console.log("User doesn't exist");
        response.sendStatus(401);
    }
    else
    {
        res.redirect('/dashboard');
    }
});

// user has submitted the login information
app.post('/signup', not_logged_in, (request, response) =>
{
    console.log("\n\nPOST /login " + request.headers);
    console.log("Session: " + request.session);
    var username = request.username;
    var password = request.password;
    var query_string = "SELECT * FROM USERS WHERE USERNAME=?";
    var query_res;
    // query db for user info
    db.query(query_string, username,(err, res)=>
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
        query_string = "CREATE TABLE ? ?";
        db.query(query_string, [username, create_user_str], (err, res) =>
        {
            if (err) console.log(err);
            console.log(res);
        })
    }
});

// the user's dashboard
app.get('/dashboard', is_logged_in, (request, response) =>
{
    var username = request.session.username;
    var query_string = "SELECT * FROM ?";
    db.query(query_string, username,function(err, response)
    {
        if (err) throw err;
        console.log(response);
    });
});


// check if the user is logged into an account
function is_logged_in(request, response, next)
{
    console.log("verifying login");
    var user = request.session.user;
    // if the user is not logged in redirect them to the login page
    if (!user)
    {
        request.session.reset();
        response.redirect("/login");
    }
    // do the next function
    else next();
}

function not_logged_in(req, res, next)
{
    console.log('verifying user is not logged in');
    if (!req.session.user)
    {
        next();
    }
    else
    {
        res.redirect("/dashboard");
    }

}

