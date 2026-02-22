import {
  Card,
  Collapse,
  Checkbox,
  Button,
  Modal,
  Form,
  Input
} from "antd";
import { useState } from "react";
import api from "../../api/api";

const { Panel } = Collapse;

function ChallengeCard({
  challenge,
  completedToday = [],
  onRefresh
}) {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [subtaskModal, setSubtaskModal] = useState({
    open: false,
    taskId: null
  });

  const tasks = challenge?.tasks || [];

  const handleComplete = async (subtaskId) => {
    try {
      await api.post("/daily/complete", { subtaskId });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Collapse ghost>
        <Panel
          header={<strong>{challenge.title}</strong>}
          key={challenge.id}
        >
          {/* TASKS */}
          {tasks.length === 0 && (
            <div style={{ opacity: 0.6 }}>
              No tasks yet.
            </div>
          )}

          {tasks.map((task) => {
            const subtasks = task?.subtasks || [];

            return (
              <Collapse key={task.id} ghost>
                <Panel header={task.title} key={task.id}>
                  
                  {/* SUBTASKS */}
                  {subtasks.length === 0 && (
                    <div style={{ opacity: 0.6 }}>
                      No subtasks yet.
                    </div>
                  )}

                  {subtasks.map((sub) => (
                    <div key={sub.id} style={{ marginBottom: 6 }}>
                      <Checkbox
                        checked={completedToday.includes(sub.id)}
                        disabled={completedToday.includes(sub.id)}
                        onChange={() => handleComplete(sub.id)}
                      >
                        {sub.title} (+{sub.xp} XP)
                      </Checkbox>
                    </div>
                  ))}

                  <Button
                    size="small"
                    style={{ marginTop: 8 }}
                    onClick={() =>
                      setSubtaskModal({
                        open: true,
                        taskId: task.id
                      })
                    }
                  >
                    + Add Subtask
                  </Button>

                </Panel>
              </Collapse>
            );
          })}

          <Button
            size="small"
            style={{ marginTop: 12 }}
            onClick={() => setTaskModalOpen(true)}
          >
            + Add Task
          </Button>

        </Panel>
      </Collapse>

      {/* CREATE TASK MODAL */}
      <Modal
        title="Create Task"
        open={taskModalOpen}
        onCancel={() => setTaskModalOpen(false)}
        footer={null}
      >
        <Form
          onFinish={async (values) => {
            try {
              await api.post("/tasks", {
                challengeId: challenge.id,
                title: values.title,
                statCategory: values.statCategory
              });

              setTaskModalOpen(false);
              if (onRefresh) onRefresh();
            } catch (err) {
              console.error(err);
            }
          }}
        >
          <Form.Item
            name="title"
            rules={[{ required: true }]}
          >
            <Input placeholder="Task Title" />
          </Form.Item>

          <Form.Item
            name="statCategory"
            rules={[{ required: true }]}
          >
            <Input placeholder="Stat Category" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Create Task
          </Button>
        </Form>
      </Modal>

      {/* CREATE SUBTASK MODAL */}
      <Modal
        title="Create Subtask"
        open={subtaskModal.open}
        onCancel={() =>
          setSubtaskModal({ open: false, taskId: null })
        }
        footer={null}
      >
        <Form
          onFinish={async (values) => {
            try {
              await api.post("/subtasks", {
                taskId: subtaskModal.taskId,
                title: values.title,
                xpValue: values.xpValue
              });

              setSubtaskModal({ open: false, taskId: null });
              if (onRefresh) onRefresh();
            } catch (err) {
              console.error(err);
            }
          }}
        >
          <Form.Item
            name="title"
            rules={[{ required: true }]}
          >
            <Input placeholder="Subtask Title" />
          </Form.Item>

          <Form.Item
            name="xpValue"
            rules={[{ required: true }]}
          >
            <Input type="number" placeholder="XP Value" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Create Subtask
          </Button>
        </Form>
      </Modal>
    </Card>
  );
}

export default ChallengeCard;