const { completeSubtask } = require("./daily.service");

exports.complete = async (req, res) => {
  try {
    const { subtaskId } = req.body;

    const result = await completeSubtask(
      req.userId,
      subtaskId
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};