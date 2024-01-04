import React, { useEffect, useState } from "react";
import Layout from "../../componenets/Layout";
import { Card, Button } from "antd";

import Table from "../../componenets/Table";
import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";

var allDashboards = [
  {
    Id: 68,
    TeamName: "naseer_ud",
    NumberOfResources: "123",
    Department: "FE",
    teamIdentificationCode: "DEV-123",
  },
  {
    Id: 69,
    TeamName: "manul_k",
    NumberOfResources: "123",
    Department: "FE",
    teamIdentificationCode: "DEV-123",
  },
  {
    Id: 70,
    TeamName: "naseer_uddin",
    NumberOfResources: "123",
    Department: "FE",
    teamIdentificationCode: "DEV-123",
  },
  {
    Id: 72,
    TeamName: "naseerud",
    NumberOfResources: "123",
    Department: "FE",
    teamIdentificationCode: "DEV-123",
  },
  {
    Id: 73,
    TeamName: "Tehmas2",
    NumberOfResources: "123",
    Department: "FE",
    teamIdentificationCode: "DEV-123",
  },
];
const Teams = () => {
  const nav = useNavigate();
  const [addUserToTeam, setAddingUserToTeam] = useState(false);
  const [loadingAddUser, setLoadingAddUser] = useState(false);

  const onFinishAddUser = () => {
    setLoadingAddUser(true);
    setTimeout(() => {
      setLoadingAddUser(false);
      setAddingUserToTeam(false);
    }, 5000);
  };
  return (
    <Layout>
      <div className={styles.container}>
        <Card
          className={styles.cardContainer}
          bordered
          title="Team Management"
          extra={
            <Button
              onClick={() => {
                nav("/TeamDetails");
              }}
              key="sider-menuitem-delete"
              style={{
                marginRight: "20px",
                marginLeft: "auto",
                marginBottom: "10px",
              }}
            >
              Add Team
            </Button>
          }
        >
          {/* {addUserToTeam && (
            <Form
              name="normal_login"
              className={styles.formContainer}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinishAddUser}
            >
              <Form.Item
                name="TeamName"
                rules={[
                  {
                    required: true,
                    message: "Please input the team name!",
                  },
                ]}
              >
                <Input
                  disabled={loadingAddUser}
                  className={styles.formInputs}
                  placeholder="Enter Team Name"
                  prefix={
                    <UserOutlined
                      className="site-form-item-icon"
                      style={{ marginRight: "10px" }}
                    />
                  }
                />
              </Form.Item>
              <Form.Item
                name="department"
                rules={[
                  {
                    required: true,
                    message: "Please input the department of the team!",
                  },
                ]}
              >
                <Input
                  disabled={loadingAddUser}
                  className={styles.formInputs}
                  placeholder="Enter Department Of The Team"
                  prefix={
                    <UserOutlined
                      className="site-form-item-icon"
                      style={{ marginRight: "10px" }}
                    />
                  }
                />
              </Form.Item>
              <Form.Item
                name="teamIdentificationCode"
                rules={[
                  {
                    required: true,
                    message:
                      "Please input the team identification code of the team!",
                  },
                ]}
              >
                <Input
                  disabled={loadingAddUser}
                  className={styles.formInputs}
                  placeholder="Enter Team Identification Code of the Team"
                  prefix={
                    <MailOutlined
                      className="site-form-item-icon"
                      style={{ marginRight: "10px" }}
                    />
                  }
                />
              </Form.Item>

              <Form.Item>
                <div className={styles.btnContainer}>
                  <Button
                    style={{ color: "red", borderColor: "red" }}
                    onClick={() => {
                      setAddingUserToTeam(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ color: "green", borderColor: "green" }}
                    htmlType="submit"
                    loading={loadingAddUser}
                  >
                    Confirm
                  </Button>
                </div>
              </Form.Item>
            </Form>
          )} */}
          <Table data={allDashboards} />
        </Card>
      </div>
    </Layout>
  );
};

export default Teams;
