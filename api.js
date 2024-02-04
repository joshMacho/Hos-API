const db = require("./dbOperations");
var Employees = require("./employees");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

//middle ware
router.use((request, responde, next) => {
  next();
});

router.route("/Employees").get((request, response) => {
  db.getEmployees().then((result) => {
    response.json(result);
  });
});

router.route("/types").get((request, response) => {
  db.getTypes().then((results) => {
    response.json(results);
  });
});

router.route("/insertEmp").post((request, response) => {
  db.addEmployee(request, response);
});

var port = process.env.port || 8090;
app.listen(port);
console.log("Hospital API is running at " + port);
