const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
//  db
const Student = require("../models/student");
const Team = require("../models/team");

// // isAuth middlware
// const { isAuth } = require("./middleware");

//* we use this varible for condition, that if user already have team or not...
let userReqInfo;

//
router.get("/", (req, res) => {
  res.redirect("/student/login");
});
// login
router.get("/login", (req, res) => {
  const emailError = req.flash("email");
  console.log(emailError);
  const passError = req.flash("pass");

  console.log(passError);

  //  for running stdlogin.ejs
  res.render("student/stdlogin", {
    title: "Student | login",
    emailError,
    passError,
  });
});

router.post("/login", (req, res) => {
  Student.findOne({ email: req.body.email })
    .then((data) => {
      if (data) {
        if (data.password == req.body.password) {
          userReqInfo = data;
          //* set cookie for student, we use student cookie information in /your-team route
          res.cookie("Student", {
            name: data.fullName,
            email: data.email,
            id: data.id,
          });
          //  for make sure , user have team
          const userReqIdTeam = userReqInfo.teamMembers;
          //  if user does not have any team  /else mean user have team
          if (userReqIdTeam == 0) {
            res.redirect("/student/selecting-group");
          } else {
            res.redirect("/student/your-team");
          }
        } else {
          req.flash("pass", "your password is incorrect");
          res.redirect("/student/login");
        }
      } else {
        req.flash("email", "Email is incorrect");
        res.redirect("/student/login");
        // res.send({ Success: "This Email Is not regestered!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: err });
    });
});

//

router.get("/your-team", async (req, res) => {
  // console.log(req.cookies.Student);
  const currentStudent = req.cookies.Student;
  // console.log(currentStudent.id);
  await Student.findById({ _id: currentStudent.id })
    .then((student) => {
      const studentTeam = student.teamMembers[0];
      const membersId = studentTeam.teamMembers;
      const members = [];

      Student.find()
        .then((studentMemberId) => {
          membersId.forEach((mrId, index) => {
            studentMemberId.forEach((stMemberId, index) => {
              if (mrId === stMemberId.id) {
                members.push(stMemberId);
              }
            });
          });
          res.render("student/existStu", { members, team: studentTeam });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
//

//  select your team members
router.get("/selecting-group", async (req, res) => {
  const studentsInfo = await Student.find()
    .then((studentData) => {
      const currentStudent = req.cookies.Student;
      console.log("current student");

      res.render("student/selectinggroup", {
        title: "Memebers",
        data: studentData,
        currentStudent: currentStudent,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: err,
      });
    });
});

router.post("/selecting-group", async (req, res) => {
  //  search for the student in Student table,
  const submittedId = req.body.studentId;
  const currentStudent = req.cookies.Student;

  const foundedStudent = [];
  Student.find()
    .then(async (student) => {
      student.forEach((st, index) => {
        submittedId.forEach((sbId, index) => {
          if (st.id === sbId) {
            foundedStudent.push(st.email);
          }
        });
      });

      foundedStudent.push(currentStudent.email);
      //  add new team Information to the team collection
      const teamInfo = new Team({
        teamName: req.body.teamName,
        teamMembers: foundedStudent,
      });

      console.log(teamInfo);
      try {
        await teamInfo.save().then((data) => {
          console.log("new team is added");
        });
      } catch (err) {
        res.json({
          message: "cant add new team",
          err: err,
        });
      }

      //  update the students that selected from the team members
      const teamMembersId = teamInfo.teamMembers;
      console.log(teamMembersId);
      try {
        teamMembersId.forEach((res, index) => {
          Student.findOneAndUpdate(
            { email: teamMembersId[index] },
            { teamMembers: teamInfo },
            (reqq, ress) => {
              console.log("students update their team");
            }
          );
        });
        res.redirect("/project/sorting-project");
      } catch (err) {
        res.json({
          message: err,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//  after student choose their team members,

//!  TESTING  ROUTE
router.get("/teamMember", async (req, res) => {
  //  team member Id in table of STUDENT
  let studentIdInStTable = [];
  let filterStudentIdStudentTable = [];
  let renderStudentIdStudentTable = [];
  //  student id in table of TEAM
  let studentIdTeamTable = [];
  let renderStudentIdTeamTable = [];
  //  we analyze studentIdTeam Table and push every single value to this variable, then we use this variable for rendering in the user interface ...
  let renderStTeamTable = [];

  Team.find()
    .then((teamData) => {
      teamData.forEach((student, index) => {
        studentIdTeamTable.push(student.teamMembers);
        /* 
            ? console.log(studentIdTeamTable || student.teamMembers);
            * output:
              [
                [ '62591e4c9218e153f4c48ee2', '62591e5b9218e153f4c48ee3' ],
                [ '62591e669218e153f4c48ee4', '62591e779218e153f4c48ee6' ],
                [ '62591e809218e153f4c48ee7', '62591ea19218e153f4c48eea' ]
              ] 
              
            - we need to analize this output and inserting data to studentIdTeamTable variable, by using two for loop
        */
      });
      //  this is for select the array inside the current array, [[], [], []], and using student id because, we grab all user then compare with all teamMembers inside table of team...
      for (let i = 0; i < studentIdTeamTable.length; i++) {
        for (let j = 0; j < studentIdTeamTable.length; j++) {
          if (!studentIdTeamTable[i][j]) {
            // console.log("pass");
          } else {
            // console.log(i + " " + studentIdTeamTable[i][j]);
            renderStudentIdTeamTable.push(studentIdTeamTable[i][j]);
          }
        }
      }

      console.log("render studetn id i Table of TEAM: ");
      console.log(renderStudentIdTeamTable);

      //  the above code is useless because we already have every user id in the template

      // console.log("render student id team table: ");
      // console.log(renderStudentIdTeamTable);
      Student.find().then((studentData) => {
        studentData.forEach((student, index) => {
          studentIdInStTable.push(student.teamMembers);

          /* 
            ? clg(studentIdInStTable)
            * output:
            [
              [{}],
              [{}]
            ]
            ----
          ? console.log(studentIdInStTable[0][0]);
            * output:
              {key:value, ...}
                - we need to analize this output and inserting data to studentIdInStTable variable, by using two for loop
          */
        });

        teamLengthInStTable = studentIdInStTable[0][0].teamMembers.length;
        for (let i = 0; i < studentIdInStTable.length; i++) {
          for (let j = 0; j < teamLengthInStTable; j++) {
            if (!studentIdInStTable[i][0]) {
              // console.log("pass");
            } else {
              // console.log(studentIdInStTable[i][0].teamMembers[j]);
              filterStudentIdStudentTable.push(
                studentIdInStTable[i][0].teamMembers[j]
              );
            }
          }
        }

        //  filter Duppliate data in an array
        renderStudentIdStudentTable = filterStudentIdStudentTable.filter(
          (item, index) => filterStudentIdStudentTable.indexOf(item) === index
        );
        console.log("render studetn id i Table of STUDENT: ");
        console.log(renderStudentIdStudentTable);

        res.render("student/teamMember", {
          title: "res.render",
          studentData,
          studentId: renderStudentIdStudentTable,
          teamMemberId: renderStudentIdTeamTable,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/teamMember", async (req, res) => {
  //  add new team Information to the team collection
  const teamInfo = new Team({
    teamName: req.body.teamName,
    teamMembers: req.body.studentId,
  });
  try {
    await teamInfo.save().then((data) => {
      console.log("new team is added");
    });
  } catch (err) {
    res.json({
      message: err,
    });
  }

  //  update the students that selected from the team members
  const teamMembersId = teamInfo.teamMembers;
  try {
    teamMembersId.forEach((res, index) => {
      Student.findOneAndUpdate(
        { _id: teamMembersId[index] },
        { teamMembers: teamInfo },
        (reqq, ress) => {
          console.log("students update their team");
        }
      );
    });
  } catch (err) {
    res.json({
      message: err,
    });
  }
});
// new teammember route

module.exports = router;
