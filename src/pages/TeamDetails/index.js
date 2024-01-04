import React from "react";
import { Card, Form, Input, Button } from "antd";
import Layout from "../../componenets/Layout";
import { useLocation } from "react-router-dom";
import styles from "./index.module.css";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

const TeamDetails = () => {
  const location = useLocation();

  return (
    <Layout>
      <div>TeamDetails</div>
      <Card title="Team Details">
        <Form
          name="normal_login"
          className={styles.formContainer}
          initialValues={{
            remember: true,
          }}
          //   onFinish={onFinishAddUser}
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
              //   disabled={loadingAddUser}
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
              //   disabled={loadingAddUser}
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
              //   disabled={loadingAddUser}
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
                // onClick={() => {
                //   setAddingUserToTeam(false);
                // }}
              >
                Cancel
              </Button>
              <Button
                style={{ color: "green", borderColor: "green" }}
                htmlType="submit"
                // loading={loadingAddUser}
              >
                Confirm
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default TeamDetails;
