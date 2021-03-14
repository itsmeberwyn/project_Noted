const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const session = require("express-session");

const conn = require("../conn");

const router = express.Router();
const commands = require("../controller/commands");

router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));
router.use(
  session({
    secret: "secretKamote",
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
  })
);

//when open just fetch the first value of note
router.get("/", (req, res) => {
  if (req.session && req.session.auth && req.session.auth.userId) {
    res.render("main.component.ejs", {
      fetchData: commands.getData(),
      noteId: 0,
      tabKey: "note",
      userId: req.session.auth.userId,
      userName: req.session.auth.userName,
    });
  } else {
    res.redirect("/login");
  }
});

//when click note button show the first value of note
router.get("/note", (req, res) => {
  if (req.session && req.session.auth && req.session.auth.userId) {
    res.render("main.component.ejs", {
      fetchData: commands.getData(),
      noteId: 0,
      tabKey: "note",
      userId: req.session.auth.userId,
      userName: req.session.auth.userName,
    });
  } else {
    res.redirect("/login");
  }
});

//get data of note ID = ?
router.get("/note/id", (req, res) => {
  const getID = req.query.id;
  res.send([{ command: commands.getData(), noteId: getID }]);
});

router.get("/note/:id", (req, res) => {
  const getID = req.params.id;

  if (req.session && req.session.auth && req.session.auth.userId) {
    res.render("main.component.ejs", {
      fetchData: commands.getData(),
      noteId: getID,
      tabKey: "note",
      userId: req.session.auth.userId,
      userName: req.session.auth.userName,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/createNote/note", (req, res) => {
  const noteName = req.query.notename;
  const listKey = req.query.listKey;

  commands.insertNote(noteName, req);
  res.redirect("/note/" + listKey);
});

router.get("/remove/note", (req, res) => {
  const idNote = req.query.noteId;

  commands.removeNote(idNote);
  // res.send(idNote);
  res.redirect("/note/" + 0);
});

router.post("/savenote/note", (req, res) => {
  commands.insertData(
    req.query.arrayId,
    req.query.arrayValue,
    req.query.title,
    req.query.key
  );

  // res.send(
  //   req.query.arrayId +
  //     " " +
  //     req.query.arrayValue +
  //     " " +
  //     req.query.title +
  //     " " +
  //     req.query.key
  // );

  // res.redirect("/note");
});

router.get("/update/note", (req, res) => {
  commands.UpdateNote(
    req.query.noteName,
    req.query.noteKey,
    req.query.checkList,
    req.query.noteId
  );

  res.send(
    req.query.noteName +
      " " +
      req.query.noteKey +
      " " +
      req.query.checkList +
      " " +
      req.query.noteId
  );
});

router.get("/update/noteCheck", (req, res) => {
  commands.UpdateCheckNoteList(req.query.objectChecked, req.query.key);

  res.send(req.query.objectChecked + " " + req.query.key);
});

router.get("/update/noteList", (req, res) => {
  commands.UpdateNoteList(req.query.noteName, req.query.noteId);

  res.send(req.query.noteName + " " + req.query.noteId);
});

/**
 *
 *        Idea TAB
 *
 *
 *
 *
 */

//go to idea tab
router.get("/idea", (req, res) => {
  if (req.session && req.session.auth && req.session.auth.userId) {
    res.render("main.component.ejs", {
      fetchData: commands.getDataIdea(),
      noteId: 0,
      tabKey: "idea",
      userId: req.session.auth.userId,
      userName: req.session.auth.userName,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/createIdea/idea", (req, res) => {
  const ideaName = req.query.ideaname;
  const ideaKey = req.query.ideaKey;

  commands.insertIdea(ideaName, req);
  res.redirect("/idea/" + ideaKey);
});

router.get("/idea/id", (req, res) => {
  const getID = req.query.id;
  res.send([{ command: commands.getDataIdea(), noteId: getID }]);
});

router.get("/idea/:id", (req, res) => {
  const getID = req.params.id;

  if (req.session && req.session.auth && req.session.auth.userId) {
    console.log(commands.getDataIdea());
    res.render("main.component.ejs", {
      fetchData: commands.getDataIdea(),
      noteId: getID,
      tabKey: "idea",
      userId: req.session.auth.userId,
      userName: req.session.auth.userName,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/update/ideaData", (req, res) => {
  commands.getDataIdea();
  commands.UpdateIdeaData(req.query.ideaData, req.query.key);
  res.send(req.query.ideaData);
});

router.get("/remove/idea", (req, res) => {
  const idIdea = req.query.idIdea;

  commands.removeIdea(idIdea);
  // res.send(idNote);
  res.redirect("/note/" + 0);
});

/**
 *
 *
 * Login User
 *
 *
 */

router.get("/login", (req, res) => {
  // if (req.session && req.session.auth && req.session.auth.userId) {
  // res.redirect("/note");
  // } else {
  res.render("Slogin.component.ejs");
  // }
});

function hash(input, salt) {
  const key = crypto.pbkdf2Sync(input, salt, 1000, 30, "sha512");
  return ["pbkdf2", "1000", salt, key.toString("hex")].join("$");
}

router.get("/hash/:input", (req, res) => {
  var hashedString = hash(req.params.input, "secretSauce");
  res.send(hashedString);
});

router.get("/create/user", (req, res) => {
  const user = req.query.username;
  const pass = req.query.password;

  const salt = crypto.randomBytes(128).toString("hex");
  const userPassword = hash(pass, salt);

  commands.createUser(user, userPassword);
  console.log(user + " " + userPassword);
  res.send("post method working");
});

router.post("/login/auth", (req, res) => {
  const username = req.body.username;
  const userPassword = req.body.password;

  console.log(username + " " + userPassword);

  commands.loginUser(username, userPassword, res, req);
});

router.get("/login/auth-check", (req, res) => {
  if (req.session && req.session.auth && req.session.auth.userId) {
    res.send("You are logged in: " + req.session.auth.userId.toString());
  } else {
    res.send("You are not logged in");
  }
});

router.get("/logout", (req, res) => {
  delete req.session.auth;
  res.send("You are logged out");
});

//export the router
module.exports = router;
