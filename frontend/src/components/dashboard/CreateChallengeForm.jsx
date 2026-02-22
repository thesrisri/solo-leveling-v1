import { Form, Input, DatePicker, Button } from "antd";
import api from "../../api/api";
import dayjs from "dayjs";

function CreateChallengeForm({ onSuccess }) {
  const onFinish = async (values) => {
    await api.post("/challenges", {
      title: values.title,
      startDate: values.dates[0].format("YYYY-MM-DD"),
      endDate: values.dates[1].format("YYYY-MM-DD"),
    });

    onSuccess();
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="title" rules={[{ required: true }]}>
        <Input placeholder="Challenge Name" />
      </Form.Item>

      <Form.Item name="dates" rules={[{ required: true }]}>
        <DatePicker.RangePicker />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Create
      </Button>
    </Form>
  );
}

export default CreateChallengeForm;