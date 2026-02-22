import { Progress } from "antd";
import { motion } from "framer-motion";
function XPBar({ xp }) {
  const percentage = xp % 100;

  return (
    <>
      <Progress
        percent={percentage}
        strokeColor={{
          "0%": "#00ffff",
          "100%": "#a020f0",
        }}
      />
      <p>Total XP: {xp}</p>
    </>
  );
}

export default XPBar;