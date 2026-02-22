import { Layout, Dropdown, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

const { Header } = Layout;

function Navbar() {
  const { logout } = useContext(AuthContext);

  const items = [
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  return (
    <Header style={{ display: "flex", justifyContent: "space-between" }}>
      <h3 style={{ color: "white" }}>Solo Leveling</h3>

      <Dropdown menu={{ items }}>
        <Avatar icon={<UserOutlined />} />
      </Dropdown>
    </Header>
  );
}

export default Navbar;