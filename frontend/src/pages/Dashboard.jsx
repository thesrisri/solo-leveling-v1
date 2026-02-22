import { Layout, Row, Col, Card, Typography, Spin, Button, Modal } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/layout/Navbar";
import XPBar from "../components/dashboard/XPBar";
import StreakCard from "../components/dashboard/StreakCard";
import RadarStats from "../components/dashboard/RadarStats";
import ChallengeCard from "../components/dashboard/ChallengeCard";
import DailyTask from "../components/dashboard/Dailytask";
import CreateChallengeForm from "../components/dashboard/CreateChallengeForm";

const { Content } = Layout;
const { Title } = Typography;

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // ✅ Refresh dashboard data
  const handleXpUpdate = async () => {
    try {
      const res = await api.get("/dashboard");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ✅ Reward milestone animation
  useEffect(() => {
    if (data?.reward) {
      Modal.success({
        title: "🎉 Milestone Unlocked!",
        content: (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>{data.reward}</h2>
            <p>You earned a streak reward!</p>
          </motion.div>
        ),
        centered: true,
      });
    }
  }, [data?.reward]);

  if (loading || !data) {
    return <Spin fullscreen />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />

      <Content style={{ padding: 24 }}>
        <Title level={2}>Level {data.level}</Title>

        {/* ✅ New Challenge Button */}
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={() => setOpen(true)}
        >
          + New Challenge
        </Button>

        {/* ✅ Challenge Creation Modal */}
        <Modal
          title="Create Challenge"
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
        >
          <CreateChallengeForm
            onSuccess={() => {
              setOpen(false);
              handleXpUpdate();
            }}
          />
        </Modal>

        {/* XP + Streak */}
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <XPBar xp={data.totalXP} />
            </Card>
          </Col>

          <Col span={12}>
            <Card>
              <StreakCard streak={data.streak} />
            </Card>
          </Col>
        </Row>

        {/* Radar + Challenge Progress */}
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={12}>
            <Card title="Stats">
              <RadarStats data={data.radar} />
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Challenges">
              {data.hierarchy.map((c) => (
                <ChallengeCard
                  key={c.id}
                  challenge={c}
                  completedToday={data.completedToday || []}
                  onRefresh={handleXpUpdate}
                />
              ))}
            </Card>
          </Col>
        </Row>

        {/* Daily Quests */}
        {/* <Row style={{ marginTop: 20 }}>
          <Col span={24}>
            <Card title="Daily Quests">
              <DailyTask
                hierarchy={data.hierarchy}
                onXpEarned={handleXpUpdate}
              />
            </Card>
          </Col>
        </Row> */}
      </Content>
    </Layout>
  );
}

export default Dashboard;
