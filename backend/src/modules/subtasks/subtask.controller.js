const { createSubtask, getSubtasksByTask } = require("./subtask.service");

exports.create = async (req, res) => {
  try {
    const { taskId, title, xpValue } = req.body;

    const subtask = await createSubtask(
      req.userId,
      taskId,
      title,
      xpValue
    );

    res.status(201).json(subtask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { taskId } = req.params;

    const subtasks = await getSubtasksByTask(
      req.userId,
      taskId
    );

    res.json(subtasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};