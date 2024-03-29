const conn = require("../conn");

const crypto = require("crypto");

var data;
var dataIdea;
var dataArchive;
var dataArchiveIdea;

const date = new Date();
const todayTime = date.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: false,
});
const todayDate = date.toLocaleDateString("en", {
  weekday: "short",
  year: "numeric",
  month: "2-digit",
  day: "numeric",
});

const nowDate = todayDate + ", " + todayTime;

const insertData = async (arrayId, arrayValues, title, key) => {
  try {
    console.log(arrayId, arrayValues, "throw from commands");

    const record = [title, arrayValues, arrayId, nowDate, key];

    const queryString =
      "UPDATE note_table SET note_title=?, note_list=?, note_keys=?, note_updateDate=? WHERE id=?  ";
    await conn.db.promise().query(queryString, record);
    getData();
  } catch (err) {
    console.log(err);
  }
};

const insertNote = async (note, deadline, lvlprio, res, req, listKey) => {
  try {
    const queryString = `INSERT INTO note_table (note_title, note_insertDate, note_updateDate, note_deadline, priority_level, userId) VALUES ('${note}', '${nowDate}', '${nowDate}', '${deadline}', '${lvlprio}' ,${req.session.auth.userId})`;

    await conn.db.promise().query(queryString);

    await getData();
    await res.redirect(`/note/${0}`);
  } catch (err) {
    console.log(err);
  }
};

const removeNote = (noteId, res) => {
  const queryString = `DELETE FROM note_table WHERE id = '${noteId}'`;
  conn.db.query(queryString, (err, result) => {
    if (err) console.log("Failed", err);
    else console.log("Remove Success! ");
    getData();
    res.redirect("/note");
  });
};

const UpdateNote = (checkedData, arrayId, arrayValues, noteId) => {
  console.log("from command");
  console.log(checkedData, arrayId, arrayValues, noteId);

  const record = [checkedData, arrayId, arrayValues, nowDate, noteId];
  const queryString =
    "UPDATE note_table SET note_list=?, note_keys=?, checked_list=?, note_updateDate=? WHERE id=?  ";
  conn.db.query(queryString, record, (err, result) => {
    if (err) throw err;
    else console.log("success");
    getData();
  });
};

const UpdateCheckNoteList = (objectChecked, key) => {
  console.log("from command");
  console.log(objectChecked, key);

  const record = [objectChecked, nowDate, key];
  const queryString =
    "UPDATE note_table SET checked_list=?, note_updateDate=? WHERE id=?  ";
  conn.db.query(queryString, record, (err, result) => {
    if (err) throw err;
    else console.log("success");
    getData();
  });
};

const UpdateNoteList = (checkedData, noteId) => {
  console.log("from command");
  console.log(checkedData, noteId);

  const record = [checkedData, nowDate, noteId];
  const queryString =
    "UPDATE note_table SET note_list=?, note_updateDate=? WHERE id=?  ";
  conn.db.query(queryString, record, (err, result) => {
    if (err) throw err;
    else console.log("success");
    getData();
  });
};

const UpdateDeadline = (deadLine, noteId) => {
  console.log("from command");
  console.log(deadLine, noteId);

  const record = [deadLine, nowDate, noteId];
  const queryString =
    "UPDATE note_table SET note_deadline=?, note_updateDate=? WHERE id=?  ";
  conn.db.query(queryString, record, (err, result) => {
    if (err) throw err;
    else console.log("success");
    getData();
  });
};

const UpdateNoteTitle = (title, noteId) => {
  console.log("from command");
  console.log(title, noteId);

  const record = [title, nowDate, noteId];
  const queryString =
    "UPDATE note_table SET note_title=?, note_updateDate=? WHERE id=?  ";
  conn.db.query(queryString, record, (err, result) => {
    if (err) throw err;
    else console.log("success");
    getData();
  });
};

function getData() {
  const queryString = "SELECT * FROM note_table";

  conn.db.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed", err);
      return;
    }
    data = JSON.parse(JSON.stringify(rows));
    // console.log("from getData method");
    // console.log(data);
  });
  return data;
}

getData();

/**
 *
 *
 *
 */

const insertIdea = (ideaTitle, req, res, ideaKey) => {
  console.log(ideaTitle + " qwrwerwer");
  const queryString = `INSERT INTO idea_table (idea_title, idea_insertDate, idea_updateDate, userId) VALUES ('${ideaTitle}', '${nowDate}', '${nowDate}',${req.session.auth.userId}) `;
  conn.db.query(queryString, (err, result) => {
    if (err) console.log("Failed", err);
    else console.log("Added Success! ");
    getDataIdea();
    res.redirect(`/idea/${ideaKey}`);
  });
};

const UpdateIdeaData = (ideaData, key) => {
  const record = [ideaData, nowDate, key];
  const queryString =
    "UPDATE idea_table SET idea_data=?, idea_updateDate=? WHERE id=?  ";
  conn.db.query(queryString, record, (err, result) => {
    if (err) throw err;
    else console.log("success");
    getDataIdea();
  });
};

const removeIdea = (ideaId, res) => {
  const queryString = `DELETE FROM idea_table WHERE id = '${ideaId}'`;
  conn.db.query(queryString, (err, result) => {
    if (err) console.log("Failed", err);
    else console.log("Remove Success!");
    getDataIdea();
    res.redirect(`/idea`);
  });
};

function getDataIdea() {
  const queryString = "SELECT * FROM idea_table";
  conn.db.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed", err);
      return;
    }
    dataIdea = JSON.parse(JSON.stringify(rows));
  });
  return dataIdea;
}
getDataIdea();

/**
 *
 *
 * user Commands
 *
 *
 *
 */

const updateSortUser = (sortType, userId, res, req) => {
  const record = [sortType, userId];
  const queryString = "UPDATE user_table SET sort_type=? WHERE id=?  ";
  conn.db.query(queryString, record, (err, result) => {
    if (err) throw err;
    else console.log("success");
    getData();
    res.redirect(`/note/${0}`);
  });
};

const createUser = (username, email, userPassword, userCPassword, res, req) => {
  conn.db.query(
    "SELECT * FROM user_table WHERE username = ?",
    [username],
    function (err, result) {
      if (err) {
        console.log("Failed");
      } else {
        if (result.length === 0) {
          if (userPassword === userCPassword) {
            conn.db.query(
              "INSERT INTO user_table (username, email, password) VALUES (?, ?, ?)",
              [username, email, userPassword],
              function (err, result) {
                if (err) console.log("Failed", err);
                else {
                  req.session.auth = {
                    userId: result.insertId,
                    userName: username,
                  };
                  res.status(200).json({ message: "Added Success" });
                }
              }
            );
          } else {
            res.status(403).json({ message: "password not match" });
            console.log("Incorrect Password");
          }
        } else {
          console.log("meron na");
          res.status(403).json({ message: "user already exist" });
        }
      }
    }
  );
};

function hash(input, salt) {
  const key = crypto.pbkdf2Sync(input, salt, 1000, 30, "sha512");
  return ["pbkdf2", "1000", salt, key.toString("hex")].join("$");
}

const loginUser = (email, userPassword, res, req) => {
  conn.db.query(
    "SELECT * FROM user_table WHERE email = ?",
    [email],
    function (err, result) {
      if (err) console.log("Failed", err);
      else {
        if (result.length === 0) {
          res.sendStatus(403);
          console.log("Username/Password is invalid");
        } else {
          const hashPasswordDB = result[0].password;
          const salt = hashPasswordDB.split("$")[2];
          const hashed = hash(userPassword, salt);

          if (hashed === hashPasswordDB) {
            req.session.auth = {
              userId: result[0].id,
              userName: result[0].username,
              sort_type: result[0].sort_type,
            };

            console.log(req.session.auth.userId);
            console.log(req.session.auth.userName);
            console.log(req.session.auth.sort_type);

            res.sendStatus(200);
            console.log("Credentials correct");
          } else {
            res.sendStatus(403);
            console.log("Username/Password is invalid");
          }
        }
      }
    }
  );
};

/**
 *
 * Archive
 *
 */

function getDataArchiveNote() {
  const queryString = "SELECT * FROM note_archive_table";
  conn.db.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed", err);
      return;
    }
    dataArchive = JSON.parse(JSON.stringify(rows));
  });
  return dataArchive;
}
getDataArchiveNote();

function getDataArchiveIdea() {
  const queryString = "SELECT * FROM idea_archive_table";
  conn.db.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed", err);
      return;
    }
    dataArchiveIdea = JSON.parse(JSON.stringify(rows));
  });
  return dataArchiveIdea;
}
getDataArchiveIdea();

module.exports = {
  getData: getData,
  insertData: insertData,
  insertNote: insertNote,
  UpdateNote: UpdateNote,
  UpdateCheckNoteList: UpdateCheckNoteList,
  UpdateNoteList: UpdateNoteList,
  removeNote: removeNote,
  getDataIdea: getDataIdea,
  insertIdea: insertIdea,
  UpdateIdeaData: UpdateIdeaData,
  removeIdea: removeIdea,
  createUser: createUser,
  loginUser: loginUser,
  getDataArchiveNote: getDataArchiveNote,
  getDataArchiveIdea: getDataArchiveIdea,
  UpdateDeadline: UpdateDeadline,
  UpdateNoteTitle: UpdateNoteTitle,
  updateSortUser: updateSortUser,
};
