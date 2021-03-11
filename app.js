const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./routes/api-routes");

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());

app.get("/api/all-apps", apiRoutes.allApplications);
app.get("/api/single-app/:id", apiRoutes.singleApplication);
app.get("/api/single-app/:id/tasks", apiRoutes.singleAppTasks);
app.get("/api/all-apps-tasks", apiRoutes.getAllTasks);
app.get("/api/all-app-ids", apiRoutes.getAllIds);
app.get("/api/refresh", apiRoutes.refreshTokens);
app.use(express.static("public")); //make available to browser these files without additional request
app.get("/*", (req, res) => {
  //all other routes - default route
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  // start app
  console.log(`Listening on port ${port}`);
});
