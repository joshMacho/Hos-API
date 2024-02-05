var config = require("./dbconfig");
const sql = require("mssql");

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
  try {
    const { params, body } = request;
    const { id } = params;
    const { password } = body;

    console.log("check the param: ", params);
    let pool = await sql.connect(config);
    let update = await pool
      .request()
      .input("id", sql.Int, id)
      .input("password", sql.NVarChar, password)
      .query("UPDATE employees SET password = @password WHERE id = @id");

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

const updatePatient = async (request, response) => {
  try {
    const { params, body } = request;
    const { id } = params;
    const {
      name,
      email,
      gender,
      contact,
      dob,
      marital_status,
      address,
      next_of_kin,
    } = body;
    let pool = await sql.connect(config);
    let insert = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, body.name)
      .input("contact", sql.NVarChar, body.contact)
      .input("email", sql.NVarChar, body.email)
      .input("gender", sql.NVarChar, body.gender)
      .input("dob", sql.NVarChar, body.dob)
      .input("m_status", sql.NVarChar, body.marital_status)
      .input("next_of", sql.NVarChar, body.next_of_kin)
      .input("address", sql.NVarChar, body.address)
      .query(
        "UPDATE patient SET name=@name, email=@email, contact=@contact, sex=@gender, dob=@dob, address=@address, marital_status=@m_status, next_of_kin=@next_of WHERE id=@id"
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

const addEmployee = async (request, response) => {
  try {
    const { body } = request;
    const { name, type, contact, email, username, password } = body;
    let pool = await sql.connect(config);
    let insert = await pool
      .request()
      .input("name", sql.NVarChar, body.name)
      .input("type", sql.NVarChar, body.type)
      .input("contact", sql.NVarChar, body.contact)
      .input("email", sql.NVarChar, body.email)
      .input("username", sql.NVarChar, body.username)
      .input("password", sql.NVarChar, body.password)
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
      gender,
      contact,
      dob,
      m_status,
      address,
      next_of_kin,
    } = body;
    let pool = await sql.connect(config);
    let insert = await pool
      .request()
      .input("name", sql.NVarChar, body.name)
      .input("contact", sql.NVarChar, body.contact)
      .input("email", sql.NVarChar, body.email)
      .input("gender", sql.NVarChar, body.gender)
      .input("dob", sql.NVarChar, body.dob)
      .input("m_status", sql.NVarChar, body.m_status)
      .input("next_of", sql.NVarChar, body.next_of_kin)
      .input("address", sql.NVarChar, body.address)
      .query(
        "INSERT INTO patient (name, email, contact, sex ,dob, address, marital_status,next_of_kin) Values(@name, @email, @contact, @gender, @dob, @address, @m_status, @next_of)"
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
      .input("patient_id", sql.NVarChar, body.patient_id)()
      .query(
        "INSERT INTO consultation (doctor_assigned, consultation, patient_name, patient_id ,temperature, weight, heart_rate, pulse) Values(@doctor,@consultation_room,@patient,@patient_id,@temperature,@weight,@heart_rate,@pulse)"
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
};
