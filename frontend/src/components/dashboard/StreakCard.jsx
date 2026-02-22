import { FireOutlined } from "@ant-design/icons";

function StreakCard({ streak }) {
  return (
    <h3>
      <FireOutlined style={{ color: "orange" }} />
      &nbsp; {streak} Day Streak
    </h3>
  );
}

export default StreakCard;