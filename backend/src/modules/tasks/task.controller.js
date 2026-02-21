const { createTask, getTasksByChallenge } = require("./task.service");

exports.create = async (req, res) => {
  try {
    const { challengeId, title, statCategory } = req.body;

    const task = await createTask(
      req.userId,
      challengeId,
      title,
      statCategory
    );

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const tasks = await getTasksByChallenge(req.userId, challengeId);

    res.json(tasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};