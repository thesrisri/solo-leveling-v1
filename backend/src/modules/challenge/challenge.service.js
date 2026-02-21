const pool = require("../../config/db");

exports.createChallenge = async (userId, title, startDate, endDate) => {
  const result = await pool.query(
    `INSERT INTO challenges (user_id, title, start_date, end_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, title, startDate, endDate]
  );

  return result.rows[0];
};

exports.getUserChallenges = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM challenges WHERE user_id = $1`,
    [userId]
  );

  return result.rows;
};

exports.extendChallenge = async (userId, challengeId, extraDays) => {
  const result = await pool.query(
    `
    UPDATE challenges
    SET end_date = end_date + ($1 || ' days')::interval
    WHERE id = $2 AND user_id = $3
    RETURNING *
    `,
    [extraDays, challengeId, userId]
  );

  if (result.rowCount === 0) {
    throw new Error("Challenge not found or unauthorized");
  }

  return result.rows[0];
};