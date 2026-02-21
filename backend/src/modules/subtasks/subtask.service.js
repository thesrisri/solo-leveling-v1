const pool = require("../../config/db");

exports.createSubtask = async (userId, taskId, title, xpValue) => {

  // Verify task belongs to user via challenge
  const taskCheck = await pool.query(
    `
    SELECT t.id 
    FROM tasks t
    JOIN challenges c ON t.challenge_id = c.id
    WHERE t.id = $1 AND c.user_id = $2
    `,
    [taskId, userId]
  );

  if (taskCheck.rowCount === 0) {
    throw new Error("Unauthorized or task not found");
  }

  const result = await pool.query(
    `INSERT INTO subtasks (task_id, title, xp_value)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [taskId, title, xpValue]
  );

  return result.rows[0];
};

exports.getSubtasksByTask = async (userId, taskId) => {

  const taskCheck = await pool.query(
    `
    SELECT t.id 
    FROM tasks t
    JOIN challenges c ON t.challenge_id = c.id
    WHERE t.id = $1 AND c.user_id = $2
    `,
    [taskId, userId]
  );

  if (taskCheck.rowCount === 0) {
    throw new Error("Unauthorized or task not found");
  }

  const result = await pool.query(
    `SELECT * FROM subtasks WHERE task_id = $1`,
    [taskId]
  );

  return result.rows;
};