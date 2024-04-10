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

const getLogs = async () => {
  try {
    let pool = await sql.connect(config);
    let logs = await pool.request().query("SELECT * FROM hospitalLogs");
    return logs.recordset;
  } catch (error) {
    console.log(error);
  }
};

const updatePassword = async (request, response) => {
  const { params, body } = request;
  const { id } = params;
  const { password, firstSignIn } = body;

  try {
    let pool = await sql.connect(config);
    const hasedPassword = await bcrypt.hash(password, 10);
    let update = await pool
      .request()
      .input("id", sql.Int, id)
      .input("firstSignIn", sql.Bit, firstSignIn)
      .input("password", sql.NVarChar, hasedPassword)
      .query(
        "UPDATE employees SET password = @password, firstSignIn = @firstSignIn WHERE id = @id"
      );

    if (update.rowsAffected[0] > 0) {
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
  const { name, type, contact, email, username, password, addedby } = body;
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
      .input("addedby", sql.NVarChar, body.addedby)
      .query(
        "INSERT INTO Employees (name, type, contact, email ,username, password, addedby) Values(@name, @type, @contact, @email, @username, @password, @addedby)"
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

const deletePat = async (request, response) => {
  const { params } = request;
  const { id } = params;
  try {
    const pool = await sql.connect(config);
    const results = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE from patient WHERE id = @id");
    if (results.rowsAffected[0] === 1) {
      response.status(200).json({ message: "Successfully deleted patient" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server error" });
  }
};

const deleteEmp = async (request, response) => {
  const { params } = request;
  const { id } = params;
  try {
    const pool = await sql.connect(config);
    const results = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE from Employees WHERE id = @id");
    if (results.rowsAffected[0] === 1) {
      response.status(200).json({ message: "Successfully deleted Employee" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server error" });
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
      officer,
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
      .input("officer", sql.NVarChar, body.officer)
      .query(
        "INSERT INTO patient (name, email, contact, sex ,dob, address, marital_status,next_of_kin,nID,officer) Values(@name, @email, @contact, @gender, @dob, @address, @m_status, @next_of, @nID, @officer)"
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
      doc_id,
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
      .input("doc_id", sql.Int, body.doc_id)
      .query(
        "INSERT INTO consultation (doctor_assigned, consultation, patient_name, patient_id ,temperature, weight, heart_rate, pulse, doc_id) Values(@doctor,@consultation_room,@patient,@patient_id,@temperature,@weight,@heart_rate,@pulse, @doc_id)"
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

const getConsultationsfordoctor = async (docid) => {
  try {
    let pool = await sql.connect(config);
    let docConsults = await pool
      .request()
      .input("id", sql.NVarChar, docid)
      .query("SELECT * FROM consultation where doc_id=@id");
    return docConsults.recordset;
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

    // const token = jwt.sign(
    //   {
    //     id: user.id,
    //     name: user.name,
    //     username: user.username,
    //     type: user.type,
    //     firstSignIn: user.firstSignIn,
    //   },
    //   "macho_monei",
    //   { expiresIn: "1h" }
    // );
    //response.cookie("session_token", token, { httpOnly: true });
    //return user; // Return the generated JWT token
    //response.status(200).json(user);
    return user;
  } catch (error) {
    response
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
    //throw error; // Re-throwing error for further handling if needed
  }
};

const logs = async (request, response) => {
  try {
    const { body } = request;
    const { action_event, affected, officer, table_action } = body;
    let pool = await sql.connect(config);
    let insert = await pool
      .request()
      .input("action", sql.NVarChar, body.action_event)
      .input("affected", sql.NVarChar, body.affected)
      .input("officer", sql.NVarChar, body.officer)
      .input("table", sql.NVarChar, body.table_action)
      .query(
        "INSERT INTO hospitalLogs(action_event, affected,officer,table_action) Values(@action,@affected,@officer,@table)"
      );
    response.status(200);
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ successful: false, message: "Internal server error" });
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
  logs: logs,
  getLogs: getLogs,
  deleteEmp: deleteEmp,
  deletePat: deletePat,
  getConsultationsfordoctor: getConsultationsfordoctor,
};
