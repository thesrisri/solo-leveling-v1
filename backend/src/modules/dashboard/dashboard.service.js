const pool = require("../../config/db");

exports.getStreak = async (userId) => {
    const result = await pool.query(
        `
    SELECT DISTINCT d.completed_date
    FROM daily_logs d
    JOIN subtasks s ON d.subtask_id = s.id
    LEFT JOIN tasks t ON s.task_id = t.id
    LEFT JOIN challenges c ON t.challenge_id = c.id
    WHERE c.user_id = $1
    ORDER BY d.completed_date DESC
    `,
        [userId]
    );

    const dates = result.rows.map(r =>
        new Date(r.completed_date).toISOString().split("T")[0]
    );

    let streak = 0;
    let currentDate = new Date();

    while (true) {
        const formatted = currentDate.toISOString().split("T")[0];

        if (dates.includes(formatted)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};
exports.calculateLevel = (totalXP) => {
    return Math.floor(Math.pow(totalXP / 100, 2 / 3)) + 1;
};

exports.getRadarStats = async (userId) => {
    const result = await pool.query(
        `
    SELECT 
      t.stat_category,
      COUNT(d.id) AS completed,
      COUNT(s.id) AS total
    FROM tasks t
    JOIN challenges c ON t.challenge_id = c.id
    JOIN subtasks s ON s.task_id = t.id
    LEFT JOIN daily_logs d ON d.subtask_id = s.id
    WHERE c.user_id = $1
    GROUP BY t.stat_category
    `,
        [userId]
    );

    return result.rows.map(row => ({
        category: row.stat_category,
        percentage:
            row.total === "0"
                ? 0
                : Math.round((row.completed / row.total) * 100)
    }));
};


exports.getChallengeProgress = async (userId) => {
    const result = await pool.query(
        `
    SELECT 
      c.id,
      c.title,
      COUNT(d.id) AS completed,
      COUNT(s.id) AS total
    FROM challenges c
    LEFT JOIN tasks t ON t.challenge_id = c.id
    LEFT JOIN subtasks s ON s.task_id = t.id
    LEFT JOIN daily_logs d ON d.subtask_id = s.id
    WHERE c.user_id = $1
    GROUP BY c.id
    `,
        [userId]
    );

    return result.rows.map(row => ({
        challengeId: row.id,
        title: row.title,
        percentage:
            row.total === "0"
                ? 0
                : Math.round((row.completed / row.total) * 100)
    }));
};

exports.checkAndGrantStreakReward = async (userId, streak) => {
    if (streak === 0 || streak % 10 !== 0) {
        return null;
    }

    const rewardType = `STREAK_${streak}`;

    try {
        await pool.query(
            `
      INSERT INTO rewards (user_id, reward_type)
      VALUES ($1, $2)
      `,
            [userId, rewardType]
        );

        return rewardType;

    } catch (err) {
        if (err.code === "23505") {
            return null; // already rewarded
        }
        throw err;
    }
};

exports.getFullHierarchy = async (userId) => {
    const result = await pool.query(
        `
    SELECT 
      c.id AS challenge_id,
      c.title AS challenge_title,
      t.id AS task_id,
      t.title AS task_title,
      s.id AS subtask_id,
      s.title AS subtask_title,
      s.xp_value
    FROM challenges c
    LEFT JOIN tasks t ON t.challenge_id = c.id
    LEFT JOIN subtasks s ON s.task_id = t.id
    WHERE c.user_id = $1
    ORDER BY c.id, t.id
    `,
        [userId]
    );

    const map = {};

    result.rows.forEach(row => {

        // Ensure challenge exists
        if (!map[row.challenge_id]) {
            map[row.challenge_id] = {
                id: row.challenge_id,
                title: row.challenge_title,
                tasks: []
            };
        }

        // Only process task if it exists
        if (row.task_id) {

            let task = map[row.challenge_id].tasks.find(
                t => t.id === row.task_id
            );

            if (!task) {
                task = {
                    id: row.task_id,
                    title: row.task_title,
                    subtasks: []
                };
                map[row.challenge_id].tasks.push(task);
            }

            // Only process subtask if it exists
            if (row.subtask_id) {
                task.subtasks.push({
                    id: row.subtask_id,
                    title: row.subtask_title,
                    xp: row.xp_value
                });
            }
        }
    });
    return Object.values(map);
};

exports.getCompletedToday = async (userId) => {
  const result = await pool.query(
    `
    SELECT s.id
    FROM daily_logs d
    JOIN subtasks s ON d.subtask_id = s.id
    JOIN tasks t ON s.task_id = t.id
    JOIN challenges c ON t.challenge_id = c.id
    WHERE c.user_id = $1
    AND d.completed_date = CURRENT_DATE
    `,
    [userId]
  );

  return result.rows.map(r => r.id);
};