let mysql = require("mysql");
let bcrypt = require("bcrypt");
let express = require("express");
let path = require("path");
let sessions = require("express-session");
let cookieParser = require('cookie-parser');

// config.json holds the credentials for the database and other important
// init settings
const init = require("./config.json");
const app = express();

// root directory
const root = path.join(__dirname, "./root");

const db = mysql.createConnection(init.db);
// const db = mysql.createPool(init.db);
// connect to the database
db.connect((err) =>
{
  if (err) throw err;
  console.log("Connected to database");
  // just to verify that it connected to the DB, print to console
  db.query("SHOW TABLES", function (err, result)
  {
    if (err) throw err;
    console.log(result);
  });
});

// set the application to use the cookies specified in config.json
app.use(cookieParser());
app.use(sessions(init.cookies));
app.use(express.static(root));

app.use((req, res, next) =>
{
  if (req.cookies.tracker && !req.session.uid)
    res.clearCookie(init.cookies.key);
  next();
});

// start the server listening on port 8080
app.listen(8080, function (err)
{
  if (err) throw err;
  console.log("Server started");
});

// Get root file path
app.get('/', function (request, response)
{
  console.log("GET / ");
  console.log(request.headers);
  console.log(request.session);
  response.sendFile(path.join(root, 'index.html'));
});

// send html file for login page
app.get("/login", is_logged_in, (req, res) =>
{
  console.log("\n\nGET /login");
  console.log(req.cookies);
  console.log(req.session);
  res.sendFile(path.join(root,"login.html"));
});

// user has submitted the login information
app.post('/login', is_logged_in, (request, response) =>
{
  console.log(request.session);

  console.log("\n\nPOST /login ");

  var username = request.headers.email;
  var password = request.headers.password;
  var query_string = "SELECT * FROM USERS WHERE EMAIL=?";

  console.log("\n\nUsername: " + username + " | Password: " + password);
  // empty username or password
  if (!username || !password)
  {
    response.sendStatus(401);
    return;
  }
  // query db for user info
  db.query(query_string, username, (err, res) =>
  {
    if (err)
    {
     console.log(err);
     console.log(err.code);
    }
    console.log(res);

    // if the response is not empty
    if (res !== undefined && res.length > 0)
    {
      let salt = res[0].PASSALT;
      if (salt !== undefined) password += salt;
      // TODO hash password here

      if (password !== res[0].PASSHASH)
      {
        console.log("Password does not match");
        response.sendStatus(401);
      }
      else
      {
        console.log("redirecting to user dashboard");
        request.session.uid = username;
        console.log("userid: ", request.session.uid);
        response.redirect(301, '/dashboard');
      }
    }
    else
    {
      console.log("User doesn't exist");
      response.sendStatus(401);
    }
  });
});

app.get("/signup", is_logged_in, (req, res) =>
{
  console.log("\n\nGET /signup\n");
  res.sendFile(path.join(root,"signup.html"));
});

// user has submitted the login information
app.post('/signup', is_logged_in, (request, response) =>
{
  console.log("\n\nPOST /signup ");
  console.log(request.headers);

  var email = request.headers.email;
  var password = request.headers.password;
  var name = request.headers.name;


  if (!email || !password || !name)
  {
    response.sendStatus(400);
    return false;
  }

  // query db for user info
  db.query("SELECT * FROM USERS WHERE EMAIL=?", email, (err, res) =>
  {
    if (err) console.log(err);
    console.log(res);

    // if the user exists reply back that they exist
    if (res !== undefined || res.length > 0)
    {
      // placeholder function
      response.sendStatus(401);
      return false;
    }
    // user does not exist, so make a new table for them
    if (create_user(name, email, password) === mysql.ER_TABLE_EXISTS_ERROR)
    {
      response.sendStatus(409);
    }
    else
    {
      request.session.uid = email;
      response.redirect("/dashboard");
    }
  });

});

// function that inserts the user into the tables and creates a new user table
function create_user(name, email, password)
{
  let passhash = bcrypt.hash(password, 64, (err, hash) =>
  {
    if (err) console.log(err);
  });

  // insert the new user in the table of users
  var data = { USERNAME: name, PASSHASH: passhash, EMAIL: email};
  db.query("INSERT INTO USERS SET ?", data, (err, res) =>
  {
    if (err)
    {
      console.log(err.code);
      return err.code;
    }
    console.log(res);
    console.log("User table created");
  });

  // create a new table for this user which stores all their info
  var query = "CREATE TABLE " + mysql.escapeId(email, true) + " LIKE template";
  db.query(query, (err, res) =>
  {
    if (err)
    {
      console.log(err.code);
      return err.code;
    }
    console.log(res);
    console.log("User inserted to users table")
  });
  return 0;
}

// the user's dashboard
app.get('/dashboard', not_logged_in, (request, response) =>
{
  var uid = request.session.uid;
  var query_string = "SELECT * FROM " + mysql.escapeId(uid, true);
  db.query(query_string, uid, function (err, res)
  {
    if (err)
    {
      console.log(err);
      response.sendStatus(501);
    }
    console.log(res);
    if (res)
    {
     response.sendFile(path.join(root,"dashboard/dashboard.html"));
    }
  });
});


// check if the user is logged into an account
function is_logged_in(request, response, next)
{
  console.log("verifying login");
  // if the user is not logged in redirect them to the login page
  if (request.session.uid && request.cookies.tracker)
  {
    console.log("redirecting to user dashboard");
    response.redirect("/dashboard");
  }
  // do the next function
  else
  {
    console.log("user not logged in");
    next();
  }
}

function not_logged_in(request, response, next)
{
  console.log('verifying user is not logged in');
  if (!request.session.uid || !request.cookies.tracker)
  {
    console.log("redirecting to login page");
    response.redirect("/login");
  }
  // do the next function
  else
  {
    console.log("user logged in");
    next();
  }
}

