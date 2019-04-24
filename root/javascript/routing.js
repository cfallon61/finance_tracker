
function onSignup()
{

}

function onLogin()
{

}

function onSubmitLogin()
{
  let pass = document.getElementById('userPassword').value;
  let email = document.getElementById('userEmail').value;

  let request = new XMLHttpRequest();
  request.open("POST", "/login", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.setRequestHeader("withCredentials", true);
  request.setRequestHeader("email", email);
  request.setRequestHeader("password", pass);

  request.onreadystatechange = () =>
  {
    if (request.readyState === XMLHttpRequest.DONE)
    {
      if (request.status < 400)
      {
        window.location.href = request.responseText;
      }
      else alert(request.responseText);
    }
  };
  request.send();
  console.log(request);
  console.log("login");
}


function validate_fields(pass, email, name, confirm)
{
  if (name === "" || pass === "" || email === "" || confirm === "")
  {
    alert("Please fill all fields.");
    return false
  }
  if (pass !== confirm)
  {
    alert("Passwords do not match.");
    return false;
  }

  return true;
}

function onSubmitSignup()
{
  let pass = document.getElementById('userPassword').value;
  let email = document.getElementById('userEmail').value;
  let name = document.getElementById("name").value;
  let confirm = document.getElementById("confirmPassword").value;

  if (validate_fields(pass, email, name, confirm))
  {
    let request = new XMLHttpRequest();
    request.open("POST", "/signup", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("withCredentials", true);
    request.setRequestHeader("email", email);
    request.setRequestHeader("password", pass);
    request.setRequestHeader("name", name);

    request.onreadystatechange = () =>
    {
      if (request.readyState === XMLHttpRequest.DONE)
      {
        if (request.status < 400)
        {
          window.location.href = request.responseText;
        }
        else alert(request.responseText);
      }
    };
    request.send();
    console.log(request.responseText);
  }
}