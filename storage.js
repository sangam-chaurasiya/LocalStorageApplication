function pushData() {
  // Declaring key, value, TTL variables
  let key = document.getElementById("key").value;
  let value = document.getElementById("value").value;
  let timeToLive = document.getElementById("timeToLive").value || "None";

  // To check if key is string
  if (parseFloat(key) === NaN || parseFloat(key) == key) {
    alert("Key should be String");
  } else {
    try {
      // to check for valid JSON; if not then goto catch
      JSON.parse(value);
      if (key !== "" && value !== "") {
        // calculating size of JSON value
        const size = new TextEncoder().encode(JSON.stringify(value)).length;
        // converting size into kb
        const JSONinkiloBytes = size / 1024;
        if (JSONinkiloBytes < 16) {
          // start Putting the key, value into storage
          let flag = true;
          // check if key is already present or not
          let allKeys = Object.keys(localStorage);
          for (let i = 0; i < allKeys.length; i++) {
            if (allKeys[i] === key) {
              flag = false;
              break;
            }
          }
          if (flag) {
            //putting key, value into storage
            localStorage.setItem(key, [timeToLive, JSON.stringify(value)]);
            document.getElementById("key").value = "";
            document.getElementById("value").value = "";
            document.getElementById("timeToLive").value = "";
            loadData();
            //Time to live property execution
            if (timeToLive !== "None") {
              setTimeout(() => {
                deleteData(key);
              }, timeToLive * 1000);
            }
            // End of putting key, value into local storage
          } else {
            alert("Key already exist!!");
          }
        } else {
          alert(
            "Key length should be less than 32 characters && JSON object should also be less than 16Kb in size"
          );
        }
      } else {
        alert("please fill up mandetory values first");
      }
    } catch (err) {
      alert("Not a valid JSON");
    }
  }
}

function loadData() {
  // loading data on UI
  document.getElementById("allData").onclick = function (event) {
    if (event.target.innerText === "DELETE") {
      let currentKey =
        event.target.parentElement.previousElementSibling.previousElementSibling
          .innerHTML;
      deleteData(currentKey);
    }
  };
  // Retrieve the object from storage
  var values = [],
    keys = Object.keys(localStorage),
    i = keys.length;
  document.getElementById("allData").innerHTML = "";
  while (i--) {
    values.push([keys[i], localStorage.getItem(keys[i])]);
    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var button = document.createElement("button");
    var textNode1 = document.createTextNode(keys[i]);
    let currentJSON = localStorage
      .getItem(keys[i])
      .split(",")
      .splice(1)
      .join("");
    var textNode2 = document.createTextNode(JSON.parse(currentJSON));
    var textNode3 = document.createTextNode("DELETE");
    td1.append(textNode1);
    td2.append(textNode2);
    button.append(textNode3);
    td3.append(button);
    tr.append(td1, td2, td3);
    //putting data into table on UI
    document.getElementById("allData").append(tr);
  }
}
//deleting key value based on provided key
function deleteData(currentKey) {
  localStorage.removeItem(currentKey);
  loadData();
}
