const bodyParser = require("body-parser");
const post = require("../routes/post");
const comment = require("../routes/comments");
const triangle = require("../routes/triangle");
const cors = require('cors')


module.exports = app => {
  app.use(cors())
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api/post", post);
  app.use("/api/comment", comment);
  app.use("/api/triangle", triangle);
};
