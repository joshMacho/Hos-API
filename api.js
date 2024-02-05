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

router.route("/getconsults").get((request, response) => {
  db.getConsults().then((result) => {
    response.json(result);
  });
});

router.route("/updatepatient/:id").put((request, response) => {
  db.updatePatient(request, response);
});

router.route("/doctors").get((request, response) => {
  db.getEmployees().then((result) => {
    response.json(result);
  });
});

router.route("/types").get((request, response) => {
  db.getTypes().then((results) => {
    response.json(results);
  });
});

router.route("/patients").get((request, response) => {
  db.getPatients().then((results) => {
    response.json(results);
  });
});

router.route("/insertEmp").post((request, response) => {
  db.addEmployee(request, response);
});

router.route("/addPatient").post((request, response) => {
  db.addPatient(request, response);
});

router.route("/addConsultations").post((request, response) => {
  db.addConsultation(request, response);
});

router.route("/updatePassword/:id").put((request, response) => {
  db.updatePassword(request, response);
});

var port = process.env.port || 8090;
app.listen(port);
console.log("Hospital API is running at " + port);
