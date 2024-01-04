import React from "react";
import { Col, Row, Button, Form, Input, Avatar } from "antd";
import {
  DesktopOutlined,
  InteractionOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Layout from "../../componenets/Layout";
import styles from "./index.module.css";
import { loginUser } from "../../services/auth.services";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const nav = useNavigate();
  const onFinish = (values) => {
    console.log("Success:", values);
    loginUser(
      values,
      () => {
        nav("/Invoices");
      },
      () => {}
    );
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Row style={{ height: "100%" }}>
        <Col flex={5} className={styles.formCard}>
          <p className={styles.title}>Log In</p>
          <Form
            name="basic"
            style={{ width: "60%" }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            layout="vertical"
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your email address!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: "100%", background: "rgb(32,77,136)" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col flex={3} className={styles.bannerCard}>
          <div className={styles.BannerTextCard}>
            <p className={styles.tagline}>
              Intuitive and fast handling <br />
              of <span>Labor</span> and <span>Invoice</span> <br /> issues
            </p>
            <div className={styles.keyPoints}>
              <div className={styles.pointDiv}>
                <Avatar size={64}>
                  <DesktopOutlined />
                </Avatar>
                <p>Easy to use on mobile and desktop devices</p>
              </div>
              <div className={styles.pointDiv}>
                <Avatar size={64}>
                  <InteractionOutlined />{" "}
                </Avatar>

                <p>Conveniently handle key official matters online</p>
              </div>
              <div className={styles.pointDiv}>
                <Avatar size={64}>
                  <FileTextOutlined />{" "}
                </Avatar>
                <p>Get access to all documentation in digital form</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Login;
