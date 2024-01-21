import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import styles from "./ResourcesModal.module.css";
const ResourcesModal = (props) => {
  const [form] = Form.useForm();
  const {
    isOpen = false,
    onClose = () => {},
    projects = [],
    userList = [
      "Waqas Siddiqui",
      "Bisma Nawaz",
      "Muhammad Tehmas Azeem",
      "Moiz Ahmed",
      "Naseer Uddin",
      "Mirza Sawleh Baig",
    ],
    teamId = null,
    teamMemberDepartments = [],
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

  useEffect(() => {
    if (modalType === "Edit") {
      console.log("formData", formData);
      form.setFieldsValue({
        teamMemberName: formData.teamMemberName,
        teamMemberDepartment: formData.teamMemberDepartment,
        projectId: formData.projects.map((project) => project.projectID),
      });
    }
  }, [modalType, isOpen]);

  const handleOk = (values) => {
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   setOpen(false);
    // }, 3000);
    console.log(values);
    resetFormValues();
  };
  const handleCancel = () => {
    onClose();
    setOpen(false);
    resetFormValues();
  };

  const resetFormValues = () => {
    form.setFieldsValue({
      teamMemberName: "",
      teamMemberDepartment: "",
      projectId: [],
    });
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
            name="resource_manage"
            className={styles.formContainer}
            initialValues={{
              remember: true,
            }}
            onFinish={handleOk}
          >
            <Form.Item
              label="Resource Name"
              name="teamMemberName"
              style={{ width: "80%" }}
              rules={[
                {
                  required: true,
                  message: "Please Select Resource!",
                },
              ]}
            >
              <Select
                showSearch
                size="large"
                placeholder="Select Resource"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {userList.map((item) => (
                  <Select.Option value={item.jiraUserAccountId}>
                    {item.jiraUserAccountName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Team Member Department"
              name="teamMemberDepartment"
              style={{ width: "80%" }}
              rules={[
                {
                  required: true,
                  message: "Please Select Team Member Department!",
                },
              ]}
            >
              <Select size="large" placeholder="Select Team Member Department">
                {teamMemberDepartments.map((item) => (
                  <Select.Option value={item}>{item}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Project(s)"
              name="projectId"
              style={{ width: "80%", marginBottom: "40px" }}
              rules={[
                {
                  required: true,
                  message: "Please select atleast once project!",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select Project(s)"
                mode="multiple"
              >
                {projects.map((item) => (
                  <Select.Option value={item.projectID}>
                    {item.projectName}
                  </Select.Option>
                ))}
              </Select>
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
                    onClick={onRemoveResource}
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
