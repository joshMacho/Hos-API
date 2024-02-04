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

const getTypes = async () => {
  try {
    let pool = await sql.connect(config);
    let emptypes = await pool.request().query("SELECT name FROM types");
    return emptypes.recordset;
  } catch (error) {
    console.log(error);
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

module.exports = {
  getEmployees: getEmployees,
  getTypes: getTypes,
  addEmployee: addEmployee,
};
