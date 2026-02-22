import { Card, Checkbox, message , Button, Modal, Form, Input} from "antd";
import api from "../../api/api";
import { useState } from "react";
import { motion } from "framer-motion";
function DailyTasks({ hierarchy, onXpEarned }) {
  const [xpGain, setXpGain] = useState(null);
  const [subtaskModal, setSubtaskModal] = useState({
    open: false,
    taskId: null,
  });
  const openSubtaskModal = (taskId) => {
    setSubtaskModal({ open: true, taskId });
  };
  const handleComplete = async (subtaskId) => {
    try {
      const res = await api.post("/daily/complete", {
        subtaskId,
      });

      const earned = res.data.xpEarned;

      setXpGain({ id: subtaskId, value: earned });

      setTimeout(() => {
        setXpGain(null);
      }, 1000);

      // 🔥 ADD THIS
      if (onXpEarned) {
        onXpEarned();
      }
    } catch (err) {
      message.warning(err.response?.data?.message);
    }
  };

  if (!hierarchy) return null;

  return (
    <>
      {hierarchy.map((challenge) => (
        <Card
          key={challenge.id}
          title={challenge.title}
          style={{ marginBottom: 20 }}
        >
          {challenge.tasks.map((task) => (
            <div key={task.id}>
              <h4>{task.title}</h4>
              <Button
                size="small"
                style={{ marginBottom: 8 }}
                onClick={() => openSubtaskModal(task.id)}
              >
                + Add Subtask
              </Button>
              {task.subtasks.map((sub) => (
                <div style={{ position: "relative" }}>
                  <Checkbox
                    key={sub.id}
                    onChange={() => handleComplete(sub.id)}
                  >
                    {sub.title} (+{sub.xp} XP)
                  </Checkbox>

                  {xpGain?.id === sub.id && (
                    <motion.div
                      initial={{ y: 0, opacity: 1 }}
                      animate={{ y: -30, opacity: 0 }}
                      transition={{ duration: 1 }}
                      style={{
                        position: "absolute",
                        right: 0,
                        color: "cyan",
                        fontWeight: "bold",
                      }}
                    >
                      +{xpGain.value} XP
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </Card>
      ))}
      <Modal
        title="Create Subtask"
        open={subtaskModal.open}
        onCancel={() => setSubtaskModal({ open: false, taskId: null })}
        footer={null}
      >
        <Form
          onFinish={async (values) => {
            await api.post("/subtasks", {
              taskId: subtaskModal.taskId,
              title: values.title,
              xpValue: values.xpValue,
            });

            setSubtaskModal({ open: false, taskId: null });
            if (onXpEarned) {
  onXpEarned();
}
          }}
        >
          <Form.Item name="title" rules={[{ required: true }]}>
            <Input placeholder="Subtask Title" />
          </Form.Item>

          <Form.Item name="xpValue" rules={[{ required: true }]}>
            <Input type="number" placeholder="XP Value" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Create Subtask
          </Button>
        </Form>
      </Modal>
    </>
  );
}

export default DailyTasks;
