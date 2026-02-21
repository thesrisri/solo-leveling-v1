const pool = require("../../config/db");

exports.createTask = async (userId, challengeId, title, statCategory) => {
  // Ensure challenge belongs to user
  const challengeCheck = await pool.query(
    `SELECT * FROM challenges WHERE id = $1 AND user_id = $2`,
    [challengeId, userId]
  );

  if (challengeCheck.rowCount === 0) {
    throw new Error("Unauthorized or challenge not found");
  }

  const result = await pool.query(
    `INSERT INTO tasks (challenge_id, title, stat_category)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [challengeId, title, statCategory]
  );

  return result.rows[0];
};

exports.getTasksByChallenge = async (userId, challengeId) => {
  // Ownership validation
  const challengeCheck = await pool.query(
    `SELECT * FROM challenges WHERE id = $1 AND user_id = $2`,
    [challengeId, userId]
  );

  if (challengeCheck.rowCount === 0) {
    throw new Error("Unauthorized or challenge not found");
  }

  const result = await pool.query(
    `SELECT * FROM tasks WHERE challenge_id = $1`,
    [challengeId]
  );

  return result.rows;
};