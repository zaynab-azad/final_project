//  !packages
const express = require("express");
const router = express.Router();

//  !middleware

//  !models
const Projects = require("../models/project");
const Project = require("../models/project");

router.get("/sorting-project", async (req, res) => {
  await Project.find()
    .then((projectsData) => {
      // res.json(projectsData);

      res.render("project/projectsorting", {
        projectsData,
      });
    })
    .catch((err) => {
      res.json({
        message: "we have err (project.js)",
        err: err,
      });
    });
});
router.post("/sorting-project", async (req, res) => {
  const projectInfo = new Project({
    projectAuthor: req.body.author,
    projectName: req.body.title,
    projectInfo: req.body.description,
  });

  try {
    await projectInfo.save().then((data) => {
      console.log(data);
      console.log("new project added");
    });
  } catch (err) {
    res.json({
      message: "we have another err...",
      err: err,
    });
  }
  res.json({
    data: projectInfo,
  });
});

// //  !test
// router.get("/jwt", authenticateToken, (req, res) => {
//   console.log("test");
// });

// router.post("/jwt", (req, res) => {
//   const user = { name: req.body.userName };

//   const accessToken = jwt.sign(user, "secret");
//   res.json({ accessToken });
// });

// // function authenticateToken(req, res, next) {
// //   //  verify to have a correct user,, authorization
// //   const authHeader = req.headers["authorization"];
// //   //  Bearer  token
// //   const token = authHeader && authHeader.split(" ")[1];

// //   if (token == null) return res.json("unAuth");
// //   jwt.verify(token, "secret", (err, user) => {
// //     if (err)
// //       return res.json({ message: "we have error, please fix it", err: err });
// //     req.user = user;
// //     next();
// //   });
// // }

module.exports = router;
