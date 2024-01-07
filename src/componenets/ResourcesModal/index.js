import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import styles from "./ResourcesModal.module.css";
const ResourcesModal = (props) => {
  const [form] = Form.useForm();
  const {
    isOpen = false,
    onClose = () => {},
    projects = [],
    formData = {},
    modalType = "Add",
    onAddResource = () => {},
    onUpdateResource = () => {},
    onRemoveResource = () => {},
  } = props;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    onClose();
    setOpen(false);
  };
  return (
    <>
      <Modal
        open={open}
        title={modalType === "Add" ? "Add Resource" : "Update Resource"}
        className="modalStyle"
        footer={null}
        onCancel={handleCancel}
      >
        <div className={styles.cardContainer}>
          <Form
            form={form}
            layout="vertical"
            name="normal_login"
            className={styles.formContainer}
            initialValues={{
              remember: true,
            }}
            onFinish={handleOk}
          >
            <Form.Item
              name="teamName"
              label="Team Name"
              style={{ width: "48%" }}
              rules={[
                {
                  required: true,
                  message: "Please Input the Team Name!",
                },
              ]}
            >
              <Input
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
              name="teamNameDep"
              label="Team Name"
              style={{ width: "48%" }}
              rules={[
                {
                  required: true,
                  message: "Please Input the Team Name!",
                },
              ]}
            >
              <Input
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
              name="teamIdentificationCode"
              label="Team Identification Code"
              style={{ width: "48%" }}
              rules={[
                {
                  required: true,
                  message: "Please Input the Team Identification Code!",
                },
              ]}
            >
              <Input
                className={styles.formInputs}
                placeholder="Enter Team Identification Code"
                prefix={
                  <MailOutlined
                    className="site-form-item-icon"
                    style={{ marginRight: "10px" }}
                  />
                }
              />
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div style={{}}>
                  <Button key="back" onClick={handleCancel}>
                    {" "}
                    Cancel{" "}
                  </Button>
                  ,
                  <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    htmlType="submit"
                  >
                    {" "}
                    {modalType === "Add" ? "Submit" : "Update"}{" "}
                  </Button>
                </div>
                {modalType === "Edit" && (
                  <Button
                    key="link"
                    //  href="https://google.com"
                    type="primary"
                    loading={loading}
                    onClick={handleOk}
                    style={{
                      background: "red",
                      borderColor: "yellow",
                    }}
                  >
                    {" "}
                    Delete Resource{" "}
                  </Button>
                )}
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>{" "}
    </>
  );
};
export default ResourcesModal;
