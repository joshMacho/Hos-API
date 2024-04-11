const db = require("./dbOperations");
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
    origin: [
      "http://localhost:3000",
      "https://m-h-s.onrender.com",
      "https://hospital-project-1fnk.vercel.app",
    ],
    //methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api", router);

//middle ware
const verifyToken = (request, response, next) => {
  const token = request.cookies.session_token;

  if (!token) {
    console.log("no token provided");
    return response
      .status(401)
      .json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, "macho_monei", (err, decoded) => {
    if (err) {
      console.log(err.message);
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

router.route("/getDiagnostics").get((request, response) => {
  db.getDiagnostics().then((results) => {
    response.json(results);
  });
});

router.route("/getdocConsults/:id").get((request, response) => {
  db.getConsultationsfordoctor(request.params.id).then((results) => {
    response.json(results);
  });
});

router.route("/updatepatient/:id").put((request, response) => {
  db.updatePatient(request, response);
});

router.route("/doctors").get((request, response) => {
  db.getDoctors().then((result) => {
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

router.route("/getLogs").get((request, response) => {
  db.getLogs().then((results) => {
    response.json(results);
  });
});

router.route("/insertEmp").post((request, response) => {
  db.addEmployee(request, response);
});

router.route("/deleteEmp/:id").delete((request, response) => {
  db.deleteEmp(request, response);
});

router.route("/deletePat/:id").delete((request, response) => {
  db.deletePat(request, response);
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

router.route("/logs").post((request, response) => {
  db.logs(request, response);
});

router.route("/updatePassword/:id").put((request, response) => {
  db.updatePassword(request, response);
});

router.route("/updateEmployee/:id").put((request, response) => {
  db.updateEmployee(request, response);
});

router.route("/login").post(async (request, response) => {
  try {
    const userData = await db.login(request, response);
    // Handle the user data here
    //console.log("this is the info", userData);
    response.status(200).json(userData); // Assuming you want to send the user data back to the client
  } catch (error) {
    console.error("Error during login:", error);
    response
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
  // try {
  //   const token = await db.login(request, response);
  //   console.log(request.body);
  //   if (token) {
  //     // jwt.verify(token, "macho_monei", (error, decoded) => {
  //     //   if (error) {
  //     //     return response.status(401).json({ message: "Authentication Error" });
  //     //   } else {
  //     //     response.cookie("session_token", token, { httpOnly: true });
  //     //     return response.status(200).json(decoded);
  //     //   }
  //     // });
  //     return response.status(200).json(token);
  //   } else {
  //     response.status(401).json({ message: "Invalid username or password" });
  //   }
  // } catch (error) {
  //   response
  //     .status(500)
  //     .json({ status: "failed", message: "Internal Server Error" });
  // }
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
