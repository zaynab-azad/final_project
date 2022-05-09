const mongoose = require("mongoose");

const conditionalProjects = new mongoose.Schema(
  {
    projectAuthor: {
      type: String,
    },
    projectName: {
      type: String,
    },
    projectInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/*  update this schema structure to just
  {
    project:[prject(schema)]
  }
*/
module.exports = mongoose.model("conditional-Projects", conditionalProjects);
