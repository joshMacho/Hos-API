const db = require("./dbOperations");
var Employees = require("./employees");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    //methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api", router);

//middle ware
const verifyToken = (request, response, next) => {
  const token = request.cookies.session_token;
  console.log(request.cookies);

  if (!token) {
    return response
      .status(401)
      .json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, "macho_monei", (err, decoded) => {
    if (err) {
      return response
        .status(401)
        .json({ message: "Unauthorized: Invalid token" });
    }

    // Token is valid, attach user data to request object
    request.user = decoded;
    next();
  });
};

router.route("/validate").get(verifyToken, (request, response) => {
  // If middleware reaches this point, token is valid
  response.json({ message: "Successful", user: request.user });
  console.log("user - ", request.user);
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

router.route("/getpatient/:id").get((request, response) => {
  db.getPatient(request.params.id).then((result) => {
    response.json(result[0]);
  });
});

router.route("/getConsult/:id").get((request, response) => {
  db.getConsult(request.params.id).then((result) => {
    response.json(result[0]);
  });
});

router.route("/addConsultations").post((request, response) => {
  db.addConsultation(request, response);
});

router.route("/updatePassword/:id").put((request, response) => {
  db.updatePassword(request, response);
});

router.route("/updateEmployee/:id").put((request, response) => {
  db.updateEmployee(request, response);
});

router.route("/login").post(async (request, response) => {
  try {
    const token = await db.login(request, response);
    if (token) {
      //response.cookie("token", token, { maxAge: 3600000 }); // Setting cookie named 'token' with the JWT token and expiry time of 1 hour (3600000 milliseconds)
      jwt.verify(token, "macho_monei", (error, decoded) => {
        if (error) {
          return response.json({ message: "Authentication Error" });
        } else {
          //response.cookie("session_token", token, { httpOnly: true });
          response.status(200).json(decoded.type);
        }
      });
    } else {
      response.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    response
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
});

// Endpoint to handle user logout
router.route("/logout").get((req, res) => {
  // Clear token cookie
  res.clearCookie("session_token");
  res.json({ message: "Logout successful" });
});

var port = process.env.port || 8090;
app.listen(port);
console.log("Hospital API is running at " + port);
