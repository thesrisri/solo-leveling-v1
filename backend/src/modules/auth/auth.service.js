const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (username, password) => {
  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     RETURNING id, username`,
    [username, hashed]
  );

  return result.rows[0];
};

exports.loginUser = async (username, password) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  if (result.rowCount === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user };
};