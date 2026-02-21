const { createChallenge, getUserChallenges } = require("./challenge.service");

exports.create = async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;

    const challenge = await createChallenge(
      req.userId,
      title,
      startDate,
      endDate
    );

    res.status(201).json(challenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  const challenges = await getUserChallenges(req.userId);
  res.json(challenges);
};

exports.extend = async (req, res) => {
  try {
    const { challengeId, extraDays } = req.body;

    const updated = await extendChallenge(
      req.userId,
      challengeId,
      extraDays
    );

    res.json(updated);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};