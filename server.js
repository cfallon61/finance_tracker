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
app.use(express.json());
app.use(sessions(init.cookies));
app.use(express.static(root));

app.use((req, res, next) =>
{
  if (req.cookies.tracker && !req.session.uid)
  {
    res.clearCookie(init.cookies.key);
  }
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
  res.sendFile(path.join(root, "login.html"));
});

// user has submitted the login information
app.post('/login', is_logged_in, (request, response) =>
{
  console.log(request.session);

  console.log("\n\nPOST /login ");

  var email = request.headers.email;
  var password = request.headers.password;

  console.log("\n\nUsername: " + email + " | Password: " + password);
  // empty username or password
  if (!email || !password)
  {
    response.status(401).send("Error: Please fill all fields.");
    return;
  }

  // query db for user info
  db.query("SELECT * FROM ?? WHERE EMAIL=?", [init.db.user_table, email], (err, res) =>
  {
    if (err) console.log("Code: ", err.code, "SQL: ", err.sql);
    console.log(res);

    // if the response is not empty
    if (res !== undefined && res.length > 0)
    {
      // compare the password to the hashed password
      if (res[0].PASSHASH === null)
      {
        response.status(401).send("Error: Invalid username or password.");
        return;
      }
      if (bcrypt.compareSync(password, res[0].PASSHASH))
      {
        console.log("Password does not match");
        response.status(401).send("Error: Invalid username or password.");

      }
      else
      {
        console.log("\nredirecting to user dashboard");
        request.session.uid = email;
        console.log("userid:", request.session.uid);
        const url = `/dashboard/${request.session.uid}`;
        console.log(url);
        response.status(202).send(url);
      }
    }
    else
    {
      console.log("User doesn't exist");
      response.status(401).send("Error: No such user.");
    }
  });
});


// function to log the user out.
app.get("/signout", not_logged_in, (req, res) =>
{
  console.log("signing user out");
  req.session.uid = null;
  req.session.destroy();
  res.redirect("/");
});

app.get("/signup", is_logged_in, (req, res) =>
{
  console.log("\n\nGET /signup\n");
  res.sendFile(path.join(root, "signup.html"));
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
    console.log("invalid password, email, or name");
    response.status(400).send("Error: Invalid Email, Name, or Password");
    return;
  }
  var passhash = bcrypt.hashSync(password, 10);

  const data = [email, name, passhash];
  check_user_in_users(data)
    .then(create_user_table)
    .then(insert_to_users_table)
    .then(() =>
    {
      request.session.uid = email;
      const url = `/dashboard/${request.session.uid}`;
      response.status(202).send(url);
    })
    .catch(err => response.status(500).send({"Error":err}));
});

// redirect the user to their dashboard. totally unnecessary
app.get("/dashboard", not_logged_in, (request, response) =>
{
  var uid = request.session.uid;
  response.redirect(`/dashboard/${uid}`);
});

// the user's dashboard
app.get('/dashboard/:uid', not_logged_in, (request, response) =>
{
  console.log("\nGET /dashboard/:", request.session.uid);
  const uid = request.session.uid;
  const query_string = "SELECT * FROM " + mysql.escapeId(uid, true);

  new Promise((resolve, reject) =>
  {
    db.query(query_string, uid, (err, res) =>
    {
      if (err) reject(err);
      else resolve(res);
    });
  }).then((res) =>
    {
      // TODO change this placeholder this may break things
      console.log("redirecting");
      response.sendFile(path.join(root, "dashboard.html"));
    })
    .catch((err) =>
    {
      console.log("Code: ", err.code, "SQL: ", err.sql);
      response.status(501).send("Error", "The server encountered an error.");
    });
});

// post request sent by the dashboard
app.post("/data", not_logged_in, (request, response) =>
{
  console.log("POST /data?", request.query);
  let init = request.query.init_load;
  let insert = request.query.insert;
  const uid = request.session.uid;
  var query_string;
  var options = [];

  console.log("init=", init, "&insert=", insert);
  // ?init=true&insert=false
  if (init === "true" && insert === 'false' )
  {
    query_string = "SELECT * FROM " + mysql.escapeId(uid, true);
  }
  // ?init=false&insert=true
  else if (init === 'false' && insert === 'true')
  {
    const values = request.body;
    const table_name = mysql.escapeId(uid, true);
    query_string = "INSERT INTO " + table_name +
      "SET TRANS_DATE=? AMOUNT=? TRANS_TYPE=? TRANS_DESCRIPTION=?" +
      "SELECT TRANS_ID FROM " + table_name + " ORDER BY TRANS_ID DESC LIMIT 1";

    options = [values.TRANS_DATE, values.AMOUNT, values.TRANS_TYPE, values.TRANS_DESCRIPTION];
  }
  else
  {
    console.log(request.session.uid, "Sent invalid parameters");
    response.status(500).send("Error: Invalid parameters.");
    return;
  }

  db.query(query_string, options, (err, res) =>
  {
    if (err)
    {
      console.log("Code:", err.code, " | SQL:", err.sql);
      response.status(500).send("Error: The server encountered an error.");
    }
    else
    {
      console.log(res);
      response.status(202).json(res);
    }
  });
});

// client function to remove an entry from the DB
app.delete("/data", not_logged_in, (request, response) =>
{
  console.log("DELETE /data?" + JSON.stringify(request.query));
  const trans_id = request.query.trans_id;
  const uid = request.session.uid;

  // if there was an error with sending the transaction id send an error
  if (trans_id === undefined || trans_id === "")
  {
    response.status(501).send("Error: transaction id:", trans_id);
    return;
  }

  const query_string = "DELETE FROM " + mysql.escapeId(uid, true) + " WHERE" +
    " TRANS_ID=?";

  db.query(query_string, trans_id, (err, res) =>
  {
    if (err)
    {
      console.log("Code:", err.code, " | SQL:", err.sql);
      response.status(501).send("Error: The server encountered an error.");
    }
    else
    {
      console.log("Deletion of", trans_id, "successful. Result:", res);
      response.status(202).send("Deletion successful.");
    }
  })
});


// query the database during creation to see if the user already exists in the table of users
function check_user_in_users(data)
{
  const email = data[0];
  return new Promise((resolve, reject) =>
  {
    db.query("SELECT * FROM ?? WHERE EMAIL=?", [init.db.user_table, email], (err, res) =>
    {
      if (err) reject([err.code, err.sql]);

      console.log(res);

      if (res !== undefined && res.length > 0) reject("User already exists.");
      else resolve(data);
    });
  });
}

// create a new table for the user
function create_user_table(data)
{
  const email = data[0];
  return new Promise((resolve, reject) =>
  {
    var query = "CREATE TABLE " + mysql.escapeId(email, true) + " LIKE template";
    db.query(query, (err, res) =>
    {
      if (err)
      {
        console.log("Code: ", err.code, "Sql: ", err.sql);
        reject("User already exists.");
      }
      else
      {
        console.log(email, " table created");
        resolve(data);
      }
    });
  });
}

// add the user to the users table
function insert_to_users_table(data)
{
  const email = data[0];
  const name = data[1];
  const hash = data[2];

  return new Promise((resolve, reject) =>
  {
    var data = {USERNAME: name, PASSHASH: hash, EMAIL: email};
    db.query("INSERT INTO ?? SET ?", [init.db.user_table, data], (err, res) =>
    {
      if (err) reject([err.code, err.sql]);
      else
      {
        console.log(email, " inserted into table of users.", "hash: ", hash);
        resolve(data);
      }
    });
  });
}

// check if the user is logged into an account
function is_logged_in(request, response, next)
{
  console.log("verifying login");
  // if the user is not logged in redirect them to the login page
  if (request.session.uid && request.cookies.tracker)
  {
    console.log("redirecting to user dashboard");
    response.redirect(`/dashboard/${request.session.uid}`);
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
    console.log("user logged in: ", request.session.uid);
    next();
  }
}

