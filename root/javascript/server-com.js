function dump_user_data() {
  var json;
  let request = new XMLHttpRequest();
  const params = "?init_load=true&insert=false";
  const url = "/data" + params;
  request.open("POST", url, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  // POST

  request.onreadystatechange = () =>
  {
    if (request.readyState === XMLHttpRequest.DONE)
    {
      if (request.status === 202)
      {
        // send to table parser
        json = JSON.parse(request.responseText);
        alert(request.responseText);
      }
      else alert(request.responseText);
    }
  };
  request.send(params);
  console.log(request);
  console.log("data dump");
  // do stuff with json
}