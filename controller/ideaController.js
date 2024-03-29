const showAddIdea = (trigger) => {
  const showIdea = document.getElementById("showAddIdea");
  if (trigger === "show") {
    showIdea.style.visibility = "visible";
  } else {
    showIdea.style.visibility = "hidden";
  }
};

const addIdea = (ideaKey) => {
  const ideaTitle = document.getElementById("ideaTitle");
  console.log(encodeURIComponent(ideaTitle.value));
  window.location.href = `http://localhost:5000/createIdea/idea?ideaname=${encodeURIComponent(
    ideaTitle.value
  )}&ideaKey=${ideaKey}`;

  // var request = new XMLHttpRequest();

  // request.onreadystatechange = function () {
  //   if (request.readyState === XMLHttpRequest.DONE) {
  //     if (request.status === 200) {
  //       window.location.href = `http://localhost:5000/idea/${ideaKey}`;
  //     }
  //   }
  // };

  // request.open(
  //   "GET",
  //   `http://localhost:5000/createIdea/idea?ideaname=${ideaTitle.value}&ideaKey=${ideaKey}`,
  //   true
  // );
  // request.send(null);
};

var showRemoveIconIdea = false;
const onClickRemoveBtnIdea = () => {
  console.log("trash click");
  const remove = document.querySelectorAll("#removeContainerIdea");

  if (showRemoveIconIdea === false) {
    for (let i = 0; i < remove.length; i++) {
      remove[i].style.display = "flex";
    }
    showRemoveIconIdea = true;
  } else {
    for (let i = 0; i < remove.length; i++) {
      remove[i].style.display = "none";
    }
    showRemoveIconIdea = false;
  }
};

const removeIdeaFromList = (idIdea) => {
  // var request = new XMLHttpRequest();
  // request.onreadystatechange = function () {
  //   if (request.readyState === XMLHttpRequest.DONE) {
  //     if (request.status === 200) {
  //       window.location.href = `http://localhost:5000/idea/${0}`; //zero for now
  //     }
  //   }
  // };
  // request.open(
  //   "GET",
  //   `http://localhost:5000/remove/idea?idIdea=${idIdea}`,
  //   true
  // );
  // request.send(null);
  window.location.href = `http://localhost:5000/remove/idea?idIdea=${idIdea}`;
};

var idKey;
var lastNode;
const getIdeaData = (key, data, noteId, idNode, current, userId) => {
  console.log(noteId, key, data, idNode, userId);

  idKey = idNode;

  const getFirstNode = document.getElementById(noteId + "idea");
  const getCurrentNode = document.getElementById(key + "idea");
  const getLastNode = document.getElementById(lastNode + "idea");

  getFirstNode.classList.add("list__notFocus");
  getCurrentNode.classList.remove("list__notFocus");
  if (lastNode != undefined && lastNode != key) {
    getLastNode.classList.add("list__notFocus");
  } else {
    const getLastNodeBackup = document.getElementById(current + "idea");
    getLastNodeBackup.classList.add("list__notFocus");
  }
  lastNode = key;

  if (lastNode !== undefined && current == key) {
    getCurrentNode.classList.remove("list__notFocus");
  }

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        const userDataIdea = [];
        const response = JSON.parse(request.response);
        console.log(response[0].command);
        response[0].command.map((data, mapkey) => {
          if (data.userId == userId) {
            userDataIdea.push(data);
          }
        });

        console.log(userDataIdea[key]);

        // const dataIdea = data.command[data.noteId].idea_data;

        CKEDITOR.instances.textAreaContent.setData(userDataIdea[key].idea_data);

        window.history.replaceState(null, null, `/idea/${key}`);
      }
    }
  };

  request.open("GET", "http://localhost:5000/idea/id?id=" + key, true);
  request.send(null);
};

const showContent = () => {
  console.log(CKEDITOR.instances.textAreaContent.getData());
};

const runFetchCkEditor = (nodeId) => {
  if (idKey === undefined) {
    idKey = nodeId;
  }

  console.log(nodeId);
  var timeoutId;
  $(function () {
    CKEDITOR.instances["textAreaContent"].on("change", function () {
      let value = CKEDITOR.instances.textAreaContent.getData();
      console.log(CKEDITOR.instances.textAreaContent.getData());

      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        DBupdateTextArea(idKey, value);
      }, 1000);
    });
  });
};

const DBupdateTextArea = (key, value) => {
  console.log(value + " new");
  var request = new XMLHttpRequest();

  request.open(
    "GET",
    `http://localhost:5000/update/ideaData?ideaData=${value}&key=${key}`,
    true
  );
  request.send(null);
  // window.location.href = `http://localhost:5000/update/ideaData?ideaData="${ciphertext}"&key=${key}`;
};
