var globalDataVariable = [];

const showAddNote = (trigger) => {
  const showNote = document.getElementById("showAddNote");
  if (trigger === "show") {
    showNote.style.visibility = "visible";
  } else {
    showNote.style.visibility = "hidden";
  }
};

var lastNode;
const getNoteData = (key, data) => {
  console.log(key);
  globalDataVariable = [];
  var request = new XMLHttpRequest();
  const sendfile = document.getElementById("sendfile");

  const getFirstNode = document.getElementById(0);
  const getCurrentNode = document.getElementById(key);
  const getLastNode = document.getElementById(lastNode);

  getFirstNode.classList.add("list__notFocus");
  getCurrentNode.classList.remove("list__notFocus");
  if (lastNode != undefined && lastNode != key) {
    getLastNode.classList.add("list__notFocus");
  }

  lastNode = key;
  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        const response = JSON.parse(request.response);
        response.map((data, idkey) => {
          const listString = data.command[data.noteId].note_list;
          const splitData = listString.split(",");
          const listKeysString = data.command[data.noteId].note_keys;
          const splitDataKey = listKeysString.split(",");

          console.log(data.command[key]);
          console.log(splitData);

          sendfile.innerHTML = `
            <div class="list__main__content__wrap">
                <div class="main__content__header">
                    <p>${data.command[key].note_title}</p>
                </div>
                <div class="main__content__remaining__edit">
                    <span>3 tasks remaining</span>
                    <a href="javascript:void(0)" onclick="editClick('${data.command[key].id}')">Edit</a>
                </div>
                <div class="main__content__add">
                    <input type="text" id="addListText" value="">
                    <button type="button" onclick="addList('${data.noteId}','${data.command[key].id}','${data.command[key].note_title}')">+</button>
                </div>
                <div class="main__content__checkbox">
                    <div class="main__content__checkbox__wrap" id="wrapLabel">

                    </div>
                </div>
            </div>
          `;

          var template = "";
          var distinct = false;
          const noteJson = data.command[key].checked_list;
          if (noteJson != "") {
            JSON.parse(noteJson).some((e) => {
              if (globalDataVariable.some((e2) => e2.id == e.id)) {
                distinct = true;
              }

              if (distinct != true) {
                globalDataVariable.push(e);
                console.log(globalDataVariable);
              }
            });
          }

          for (let i = 0; i < splitData.length; i++) {
            if (splitData[0] != "") {
              if (
                noteJson != "" &&
                JSON.parse(noteJson).some(
                  (e) => e.id.replace("checkBox", "") == i + 1
                )
              ) {
                template += `
                <div class="checkBoxLabel checkBoxLabel${i}">
                  <label for="">
                  <input type="checkbox" class="ClasscheckBox" value="${splitDataKey[i]},${splitData[i]}" id="${splitDataKey[i]}checkBox" onclick="checkboxClick('${splitDataKey[i]}checkBox','','${data.command[key].id}')" checked>
                  <span id="${splitDataKey[i]}checkBoxSpan" class="checkedList spanListText" >${splitData[i]}</span>
                  <input style="text-decoration: line-through;" type="text" class="editListTextInput" value="${splitData[i]}">
                  </label>
                  <a class="removeBtn get${splitDataKey[i]}" href="javascript:void(0)" onclick="removeClick('${splitDataKey[i]}','${splitData}','${data.command[key].id}')" id="checkBoxRemove" value="${splitDataKey[i]}"><img width="15" src="../assets/images/removeIcon.png" alt=""></a>
                </div>
                  `;
              } else {
                template += `
                <div class="checkBoxLabel checkBoxLabel${i}">
                  <label for="">
                  <input type="checkbox" class="ClasscheckBox" value="${splitDataKey[i]},${splitData[i]}" id="${splitDataKey[i]}checkBox" onclick="checkboxClick('${splitDataKey[i]}checkBox','','${data.command[key].id}')" >
                  <span id="${splitDataKey[i]}checkBoxSpan" class="spanListText">${splitData[i]}</span>
                  <input type="text" class="editListTextInput" value="${splitData[i]}">                  
                  </label>
                  <a class="removeBtn get${splitDataKey[i]}" href="javascript:void(0)" onclick="removeClick('${splitDataKey[i]}','${splitData}','${data.command[key].id}')" id="checkBoxRemove" value="${splitDataKey[i]}"><img width="15" src="../assets/images/removeIcon.png" alt=""></a>
                </div>
                `;
              }
            }
          }
          document.getElementById("wrapLabel").innerHTML = template;
        });
      }
    }
  };

  request.open("GET", "http://localhost:5000/note/id?id=" + key, true);
  request.send(null);
};

const addList = (listData, listId, listTitle) => {
  console.log(listData);
  console.log(listId);
  console.log(listTitle);

  const list = document.getElementById("addListText").value;
  const divList = document.getElementById("wrapLabel");

  if (list.replace(/\s/g, "").length) {
    var newId = document.querySelectorAll("[type=checkbox]").length + 1;

    console.log(newId);
    var stringTemp = `
      <div class="checkBoxLabel checkBoxLabel${newId - 1}">
        <label for="">
            <input type="checkbox" class="ClasscheckBox" value="${
              newId + "," + list
            }" id="${newId}checkBox" onclick="checkboxClick('${newId}checkBox','')" >
            <span class="spanListText" id='${newId}checkBoxSpan'>${list}</span>
            <input type="text" class="editListTextInput" value="${list}">                  
        </label>
        <a class="removeBtn get${newId}" href="javascript:void(0)" onclick="removeClick('${newId}','${listData}','${listId}')" id="checkBoxRemove" value="${newId}"><img width="15" src="../assets/images/removeIcon.png" alt=""></a>
      </div>
      `;

    divList.innerHTML += stringTemp;
    document.getElementById("addListText").value = "";
  }
  passtoUrl("", listTitle, listId);
};

const checkboxClick = (idKey, originalData, key) => {
  console.log(originalData);
  console.log(key);

  if (globalDataVariable.length == 0 && originalData != "") {
    console.log(originalData === "");
    globalDataVariable = JSON.parse(originalData);
  }

  if (globalDataVariable == "") {
    globalDataVariable = [];
  }

  const checkboxId = document.getElementById(idKey).value;
  const checkSpanId = document.getElementById(idKey + "Span");

  console.log(checkboxId);
  var dataElement = {};

  if (document.getElementById(idKey).checked) {
    dataElement.id = idKey;
    dataElement.checked = true;
    globalDataVariable.push(dataElement);
    checkSpanId.classList.add("checkedList");
  } else {
    const index = globalDataVariable.filter((item) => item.id != idKey);
    globalDataVariable = index;
    checkSpanId.classList.remove("checkedList");
  }

  var timeoutId;
  $(`.ClasscheckBox`).on("input propertychange change", function () {
    console.log("running");

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      DBupdateCheckBox(key);
    }, 100);
  });
};

function DBupdateCheckBox(key) {
  console.log("from functionm");
  console.log(globalDataVariable);
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
      }
    }
  };

  request.open(
    "GET",
    `http://localhost:5000/update/noteCheck/?objectChecked=${JSON.stringify(
      globalDataVariable
    )}&key=${key}`,
    true
  );

  request.send(null);
}

const passtoUrl = (originalData, title, key) => {
  console.log(originalData);
  console.log(key);
  console.log(title);

  if (originalData != "") {
    for (let i = 0; i < JSON.parse(originalData).length; i++) {
      if (globalDataVariable.includes(JSON.parse(originalData)[i])) {
        globalDataVariable.push(JSON.parse(originalData)[i]);
      }
    }
  }

  console.log(globalDataVariable);

  if (globalDataVariable == "" && originalData != "") {
    globalDataVariable = JSON.parse(originalData);
    console.log(globalDataVariable);
  }

  const fetchList = document.querySelectorAll('input[type="checkbox"]');
  const allList = document.querySelectorAll(".spanListText");

  var idArray = [];
  var valueArray = [];
  for (let i = 0; i < fetchList.length; i++) {
    const splitData = fetchList[i].value.split(",");
    idArray.push(splitData[0]);
    valueArray.push(allList[i].innerHTML);
  }

  console.log(valueArray);

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
      }
    }
  };
  request.open(
    "POST",
    `http://localhost:5000/savenote/note/?arrayId=${idArray}&arrayValue=${valueArray}&title=${title}&key=${key}`,
    true
  );

  request.send(null);
};

const addNote = () => {
  const noteTitle = document.getElementById("noteTitle");
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        window.location.href = "http://localhost:5000/note";
      }
    }
  };
  request.open(
    "GET",
    `http://localhost:5000/createNote/note?notename=${noteTitle.value}`,
    true
  );
  request.send(null);
};

const editClick = (noteId) => {
  console.log(noteId);

  var timeoutId;
  $(`.editListTextInput`).on("input propertychange change", function () {
    console.log("running");

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      saveToDB(noteId);
    }, 1000);
  });

  const checkBoxRemove = document.querySelectorAll(".removeBtn");
  const spanListText = document.querySelectorAll(".spanListText");
  const editListTextInput = document.getElementsByClassName(
    "editListTextInput"
  );

  // console.log(editListTextInput.length);
  if (checkBoxRemove.length > 0) {
    if (
      checkBoxRemove[0].style.visibility == "" ||
      checkBoxRemove[0].style.visibility == "hidden"
    ) {
      for (let data of checkBoxRemove) {
        data.style.visibility = "visible";
      }
      for (let data of editListTextInput) {
        data.style.visibility = "visible";
      }
      for (let data of spanListText) {
        data.style.display = "none";
      }
    } else {
      for (let data of checkBoxRemove) {
        data.style.visibility = "hidden";
      }

      for (let i = 0; i < editListTextInput.length; i++) {
        editListTextInput[i].style.visibility = "hidden";
        spanListText[i].innerHTML = editListTextInput[i].value;
      }

      for (let data of spanListText) {
        data.style.display = "inline-block";
      }
    }
  }
};

function saveToDB(noteId) {
  const allInput = document.querySelectorAll(".editListTextInput");
  var arrayName = [];

  allInput.forEach((item, idkey) => {
    arrayName.push(item.value);
  });

  console.log(arrayName);

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
      }
    }
  };

  request.open(
    "GET",
    `http://localhost:5000/update/noteList?noteName=${arrayName}&noteId=${noteId}`,
    true
  );
  request.send(null);
  console.log("Saving to the db");
  // window.location.href = `http://localhost:5000/update/noteList?noteName=${arrayName}&noteId=${noteId}`;
}

const removeClick = (key, arrayData, noteId) => {
  console.log(key);
  console.log(arrayData);
  console.log(noteId);

  const NodeList = document.querySelector(`.checkBoxLabel${key - 1}`);
  NodeList.remove();

  const allCheckBox = document.querySelectorAll('input[type="checkbox"]');
  const allInput = document.querySelectorAll(".editListTextInput");

  var setNewArrayObj = [];
  var arrayId = [];
  var arrayName = [];

  allCheckBox.forEach((item, idkey) => {
    if (allCheckBox[idkey].checked) {
      setNewArrayObj.push({
        id: `${idkey + 1}checkBox`,
        checked: true,
      });
    }
  });

  allInput.forEach((item, idkey) => {
    arrayId.push(idkey + 1);
    arrayName.push(item.value);
  });

  console.log(setNewArrayObj);
  console.log(arrayId);
  console.log(arrayName);

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
      }
    }
  };
  request.open(
    "GET",
    `http://localhost:5000/update/note?noteName=${arrayName}&noteKey=${arrayId}&checkList=${JSON.stringify(
      setNewArrayObj
    )}&noteId=${noteId}`,
    true
  );
  request.send(null);

  //remove list item working
  //edit list item not yet done

  // window.location.href = `http://localhost:5000/update/note?noteName=${arrayName}&noteId=${arrayId}&checkList=${JSON.stringify(
  //   setNewArrayObj
  // )}`;
};
