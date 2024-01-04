import React from "react";
import { Layout, Menu } from "antd";
import styles from "./index.module.css";
import { NavLink } from "react-router-dom";
import { LogoutUser } from "../../services/auth.services";
import { getItem } from "../../utils/storage";
const { Header, Content } = Layout;

const App = (props) => {
  const user = getItem("user");
  return (
    <Layout style={{ height: "100%" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0px",
        }}
      >
        <Menu
          theme="light"
          mode="horizontal"
          style={{
            minWidth: "100%",
            width: "100%",
          }}
        >
          <Menu.Item key="Logo">
            <span className={styles.logo}>Logo</span>
          </Menu.Item>
          <Menu.Item key="/Invoices">
            <NavLink to="/Invoices">
              <span>Invoices</span>
            </NavLink>
          </Menu.Item>
          {user.role === "Admin" && (
            <Menu.Item key="/Teams">
              <NavLink to="/Teams">
                <span>Teams</span>
              </NavLink>
            </Menu.Item>
          )}
          <Menu.Item key="/" onClick={LogoutUser}>
            <NavLink to="/">
              <span>Logout</span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>{props.children}</Content>
    </Layout>
  );
};
export default App;
