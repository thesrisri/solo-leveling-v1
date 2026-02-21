const pool = require("../../config/db");
const {
    getStreak,
    calculateLevel,
    getRadarStats,
    checkAndGrantStreakReward,
    getFullHierarchy,
    getCompletedToday
} = require("./dashboard.service");

const { getChallengeProgress } = require("./dashboard.service");
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.userId;

        const userResult = await pool.query(
            `SELECT total_xp FROM users WHERE id = $1`,
            [userId]
        );

        
        const totalXP = userResult.rows[0].total_xp;

        const streak = await getStreak(userId);
        const radar = await getRadarStats(userId);
        const level = calculateLevel(totalXP);
        const reward = await checkAndGrantStreakReward(userId, streak);
        const challenges = await getChallengeProgress(userId);
        const hierarchy = await getFullHierarchy(userId);
        const completedToday = await getCompletedToday(userId);
        res.json({
            totalXP,
            level,
            streak,
            radar,
            challenges,
            reward,
            hierarchy,
            completedToday
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};