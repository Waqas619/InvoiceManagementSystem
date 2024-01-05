import React, { useState } from "react";
import { Col, Row, Button, Form, Input, Avatar, Modal } from "antd";
import {
  DesktopOutlined,
  InteractionOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import styles from "./index.module.css";
import { loginUser } from "../../services/auth.services";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const nav = useNavigate();
  const [modal, contextHolder] = Modal.useModal();

  const [loadingLogin, setLoadingLogin] = useState(false);
  const onFinish = (values) => {
    setLoadingLogin(true);
    loginUser(
      values,
      () => {
        nav("/Invoices");
      },
      () => {
        setLoadingLogin(false);
        modal.error({
          title: "Login Failed",
          content: "Please check your credentials and try again",
          centered: true,
        });
      }
    );
  };

  return (
    <Row style={{ height: "100%" }}>
      {contextHolder}

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
          autoComplete="off"
        >
          <Form.Item
            label="Username"
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
              loading={loadingLogin}
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
  );
};

export default Login;
