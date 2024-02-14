const { response } = require("express");
var config = require("./dbconfig");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function getEmployees() {
  try {
    let pool = await sql.connect(config);
    let employees = await pool.request().query("SELECT * FROM employees");
    return employees.recordset;
  } catch (error) {
    console.log(error);
  }
}

async function getDoctors() {
  try {
    let pool = await sql.connect(config);
    let employees = await pool
      .request()
      .query("SELECT * FROM employees WHERE type = 'Doctor'");
    return employees.recordset;
  } catch (error) {
    console.log(error);
  }
}

const getTypes = async () => {
  try {
    let pool = await sql.connect(config);
    let emptypes = await pool.request().query("SELECT name FROM types");
    return emptypes.recordset;
  } catch (error) {
    console.log(error);
  }
};

const getPatients = async () => {
  try {
    let pool = await sql.connect(config);
    let emptypes = await pool.request().query("SELECT * FROM patient");
    return emptypes.recordset;
  } catch (error) {
    console.log(error);
  }
};

const getConsults = async () => {
  try {
    let pool = await sql.connect(config);
    let consults = await pool.request().query("SELECT * FROM consultation");
    return consults.recordset;
  } catch (error) {
    console.log(error);
  }
};

const updatePassword = async (request, response) => {
  const { params, body } = request;
  const { id } = params;
  const { password } = body;

  try {
    let pool = await sql.connect(config);
    const hasedPassword = await bcrypt.hash(password, 10);
    let update = await pool
      .request()
      .input("id", sql.Int, id)
      .input("password", sql.NVarChar, hasedPassword)
      .query("UPDATE employees SET password = @password WHERE id = @id");

    if (update.rowsAffected[0] > 0) {
      console.log("the password: ", password);
      response
        .status(200)
        .json({ successful: true, message: "Password updated successfully" });
    } else {
      response
        .status(404)
        .json({ successful: false, message: "Employee not found" });
    }
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ successful: false, message: "Internal Server Error" });
  }
};

const getPatient = async (patientID) => {
  try {
    let pool = await sql.connect(config);
    let patient = await pool
      .request()
      .input("id", sql.Int, patientID)
      .query("Select * from patient where id=@id");
    return patient.recordset;
  } catch (error) {
    console.log(error);
  }
};

const updatePatient = async (request, response) => {
  try {
    const { params, body } = request;
    const { id } = params;
    const {
      name,
      email,
      sex,
      contact,
      dob,
      marital_status,
      address,
      next_of_kin,
      nID,
    } = body;
    let pool = await sql.connect(config);
    let insert = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, body.name)
      .input("contact", sql.NVarChar, body.contact)
      .input("email", sql.NVarChar, body.email)
      .input("gender", sql.NVarChar, body.sex)
      .input("dob", sql.NVarChar, body.dob)
      .input("m_status", sql.NVarChar, body.marital_status)
      .input("next_of", sql.NVarChar, body.next_of_kin)
      .input("address", sql.NVarChar, body.address)
      .input("nID", sql.NVarChar, body.nID)
      .query(
        "UPDATE patient SET name=@name, email=@email, contact=@contact, sex=@gender, dob=@dob, address=@address, marital_status=@m_status, next_of_kin=@next_of, nID=@nID WHERE id=@id"
      );
    response
      .status(200)
      .json({ succesful: true, message: "User Updated Successfully" });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ successful: false, message: "Internal Server Error" });
  }
};

const updateEmployee = async (request, response) => {
  try {
    const { params, body } = request;
    const { id } = params;
    const { name, type, contact, email, username } = body;
    let pool = await sql.connect(config);
    let upd = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, body.name)
      .input("type", sql.NVarChar, body.type)
      .input("contact", sql.NVarChar, body.contact)
      .input("email", sql.NVarChar, body.email)
      .input("username", sql.NVarChar, body.username)
      .query(
        "UPDATE employees SET name=@name, type=@type, contact=@contact,email=@email,username=@username WHERE id=@id"
      );
    response
      .status(200)
      .json({ successful: true, message: "User updated Successfully" });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ succcessful: false, message: "Internal Server Error" });
  }
};

const addEmployee = async (request, response) => {
  const { body } = request;
  const { name, type, contact, email, username, password } = body;
  try {
    let pool = await sql.connect(config);
    const hasedPassword = await bcrypt.hash(password, 10);

    let insert = await pool
      .request()
      .input("name", sql.NVarChar, body.name)
      .input("type", sql.NVarChar, body.type)
      .input("contact", sql.NVarChar, body.contact)
      .input("email", sql.NVarChar, body.email)
      .input("username", sql.NVarChar, body.username)
      .input("password", sql.NVarChar, hasedPassword)
      .query(
        "INSERT INTO employees (name, type, contact, email ,username, password) Values(@name, @type, @contact, @email, @username, @password)"
      );
    response
      .status(200)
      .json({ succesful: true, message: "Data inserted successfully" });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ successful: false, message: "Internal Server Error" });
  }
};

const addPatient = async (request, response) => {
  try {
    const { body } = request;
    const {
      name,
      email,
      sex,
      contact,
      dob,
      marital_status,
      address,
      next_of_kin,
      nID,
    } = body;
    let pool = await sql.connect(config);
    let insert = await pool
      .request()
      .input("name", sql.NVarChar, body.name)
      .input("contact", sql.NVarChar, body.contact)
      .input("email", sql.NVarChar, body.email)
      .input("gender", sql.NVarChar, body.sex)
      .input("dob", sql.NVarChar, body.dob)
      .input("m_status", sql.NVarChar, body.marital_status)
      .input("next_of", sql.NVarChar, body.next_of_kin)
      .input("address", sql.NVarChar, body.address)
      .input("nID", sql.NVarChar, body.nID)
      .query(
        "INSERT INTO patient (name, email, contact, sex ,dob, address, marital_status,next_of_kin,nID) Values(@name, @email, @contact, @gender, @dob, @address, @m_status, @next_of, @nID)"
      );
    response
      .status(200)
      .json({ succesful: true, message: "Data inserted successfully" });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ successful: false, message: "Internal Server Error" });
  }
};

const addConsultation = async (request, response) => {
  try {
    const { body } = request;
    const {
      patient,
      patient_id,
      doctor,
      consultation_room,
      pulse,
      temperature,
      weight,
      heart_rate,
    } = body;

    let pool = await sql.connect(config);
    let insert = await pool
      .request()
      .input("patient", sql.NVarChar, body.patient)
      .input("doctor", sql.NVarChar, body.doctor)
      .input("consultation_room", sql.NVarChar, body.consultation_room)
      .input("pulse", sql.NVarChar, body.pulse)
      .input("temperature", sql.NVarChar, body.temperature)
      .input("weight", sql.NVarChar, body.weight)
      .input("heart_rate", sql.NVarChar, body.heart_rate)
      .input("patient_id", sql.Int, body.patient_id)
      .query(
        "INSERT INTO consultation (doctor_assigned, consultation, patient_name, patient_id ,temperature, weight, heart_rate, pulse) Values(@doctor,@consultation_room,@patient,@patient_id,@temperature,@weight,@heart_rate,@pulse)"
      );

    response
      .status(200)
      .json({ succesful: true, message: "Consultation Sent" });
  } catch (error) {
    console.log(error);
    /*
    response
      .status(500)
      .json({ successful: false, message: "Internal Server Error" });*/
  }
};

const getConsult = async (consultID) => {
  try {
    let pool = await sql.connect(config);
    let patient = await pool
      .request()
      .input("id", sql.Int, consultID)
      .query("Select * from consultation where id=@id");
    return patient.recordset;
  } catch (error) {
    console.log(error);
  }
};

const login = async (request, response) => {
  const { username, password } = request.body;

  try {
    let pool = await sql.connect(config);
    const results = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query("SELECT * FROM Employees where username=@username");

    const user = results.recordset[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null; // Return null if username/password is invalid
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        type: user.type,
      },
      "macho_monei",
      { expiresIn: "1h" }
    );
    response.cookie("session_token", token, { httpOnly: true });
    return token; // Return the generated JWT token
  } catch (error) {
    response
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
    throw error; // Re-throwing error for further handling if needed
  }
};

module.exports = {
  getEmployees: getEmployees,
  getTypes: getTypes,
  addEmployee: addEmployee,
  updatePassword: updatePassword,
  addPatient: addPatient,
  getPatients: getPatients,
  getDoctors: getDoctors,
  addConsultation: addConsultation,
  updatePatient: updatePatient,
  getConsults: getConsults,
  getPatient: getPatient,
  updateEmployee: updateEmployee,
  getConsult: getConsult,
  login: login,
};
