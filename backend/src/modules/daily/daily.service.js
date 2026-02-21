const pool = require("../../config/db");

exports.completeSubtask = async (userId, subtaskId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Verify ownership through joins
    const check = await client.query(
      `
      SELECT s.xp_value, u.id AS user_id
      FROM subtasks s
      JOIN tasks t ON s.task_id = t.id
      JOIN challenges c ON t.challenge_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE s.id = $1 AND u.id = $2
      `,
      [subtaskId, userId]
    );

    if (check.rowCount === 0) {
      throw new Error("Unauthorized or subtask not found");
    }

    const xpValue = check.rows[0].xp_value;

    // Insert daily log
    await client.query(
      `
      INSERT INTO daily_logs (subtask_id, completed_date)
      VALUES ($1, CURRENT_DATE)
      `,
      [subtaskId]
    );

    // Update total XP
    await client.query(
      `
      UPDATE users
      SET total_xp = total_xp + $1
      WHERE id = $2
      `,
      [xpValue, userId]
    );
    const streak = await require("../dashboard/dashboard.service").getStreak(userId);
    await require("../dashboard/dashboard.service").checkAndGrantStreakReward(userId, streak);
    await client.query("COMMIT");

    return { message: "Completed", xpEarned: xpValue };

  } catch (err) {
    await client.query("ROLLBACK");

    if (err.code === "23505") {
      // UNIQUE violation
      throw new Error("Already completed today");
    }

    throw err;
  } finally {
    client.release();
  }
};