import React, { useEffect, useState } from "react";
import Layout from "../../componenets/Layout";
import {
  Card,
  Button,
  Input,
  Form,
  Breadcrumb,
  DatePicker,
  Select,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  KeyOutlined,
  IeOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { getAllProjects } from "../../services/projects.services";
import styles from "./index.module.css";
import {
  createInvoice,
  validateJiraHours,
} from "../../services/invoices.services";
import moment from "moment";
import { DateFormater } from "../../utils/helperFunctions";

const InvoiceDetails = () => {
  const [addUserToTeam, setAddingUserToTeam] = useState(false);
  const [loadingAddUser, setLoadingAddUser] = useState(false);
  const [loadingValidate, setLoadingValidate] = useState(false);
  const [validatedHours, setValidatedHours] = useState(false);
  const [projects, setProjects] = useState([]);

  const onFinishAddUser = async (values) => {
    if (validatedHours) {
      setLoadingAddUser(true);
      const formData = new FormData();

      const temp = Object.keys(values);
      console.log("TEMP", temp);
      temp.map((item) => {
        console.log("Checking map", values[item]);
        formData.append(`${item}`, values[item]);
      });
      const invoiceForm = new FormData();
      invoiceForm.append("invoice", JSON.stringify(values));
      const data = createInvoice(invoiceForm);

      setTimeout(() => {
        setLoadingAddUser(false);
        setAddingUserToTeam(false);
      }, 5000);
    } else {
      console.log("Checking Values", values.billingStartTime);
      setLoadingValidate(true);
      const request = {
        teamId: values.teamId,
        billingStartDate: DateFormater(values.billingStartTime),
        billingEndDate: DateFormater(values.billingEndTime),
        totalHours: values.numberOfHours,
      };
      console.log("request", request);
      const data = await validateJiraHours(request);
      setLoadingValidate(false);
      if (data === true) {
        setValidatedHours(true);
      }
    }
  };

  const loadDetails = async () => {
    const projectData = await getAllProjects();
    setProjects(projectData);
  };

  useEffect(() => {
    loadDetails();
  }, []);
  return (
    <Layout>
      <div className={styles.container}>
        <Card
          className={styles.cardContainer}
          bordered
          title={`${
            window.location.pathname === "/InvoiceDetails"
              ? "Invoice Details"
              : "Add Invoice"
          }`}
          extra={[
            <>
              {window.location.pathname === "/InvoiceDetails" && (
                <Button style={{ color: "red", borderColor: "red" }}>
                  <DeleteOutlined />
                  Delete Invoice
                </Button>
              )}
            </>,
          ]}
        >
          <Breadcrumb
            items={[
              {
                title: (
                  <NavLink to="/Invoices">
                    <span>Invoice Management</span>
                  </NavLink>
                ),
              },

              {
                title: `${
                  window.location.pathname === "/InvoiceDetails"
                    ? "Invoice Details"
                    : "Add Invoice"
                }`,
              },
            ]}
          />
        </Card>
        <div className={styles.cardContainer}>
          <Form
            layout="vertical"
            name="normal_login"
            className={styles.formContainer}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinishAddUser}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Form.Item
                name="invoiceName"
                label="Invoice Name"
                style={{ width: "48%" }}
                rules={[
                  {
                    required: true,
                    message: "Please input the invoice name!",
                  },
                ]}
              >
                <Input
                  disabled={loadingAddUser}
                  className={styles.formInputs}
                  placeholder="Enter Invoice Name"
                  prefix={
                    <UserOutlined
                      className="site-form-item-icon"
                      style={{ marginRight: "10px" }}
                    />
                  }
                />
              </Form.Item>
              <Form.Item
                name="vendorName"
                label="Vendor Name"
                style={{ width: "48%" }}
                rules={[
                  {
                    required: true,
                    message: "Please input the vendor name!",
                  },
                ]}
              >
                <Input
                  disabled={loadingAddUser}
                  className={styles.formInputs}
                  placeholder="Enter the vendor name"
                  prefix={
                    <UserOutlined
                      className="site-form-item-icon"
                      style={{ marginRight: "10px" }}
                    />
                  }
                />
              </Form.Item>
            </div>
            <Form.Item
              name="summary"
              label="Invoice Summary"
              rules={[
                {
                  required: true,
                  message: "Please input the summary of the invoice!",
                },
              ]}
            >
              <Input
                disabled={loadingAddUser}
                className={styles.formInputs}
                placeholder="Enter Summary Of The Invoice"
                prefix={
                  <UserOutlined
                    className="site-form-item-icon"
                    style={{ marginRight: "10px" }}
                  />
                }
              />
            </Form.Item>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Form.Item
                name="billingStartTime"
                label="Billing Period Start"
                style={{ marginRight: "50px" }}
                rules={[
                  {
                    required: true,
                    message: "Please input the start date!",
                  },
                ]}
              >
                <DatePicker
                  disabled={validatedHours}
                  placeholder="Enter the start date"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="billingEndTime"
                label="Billing Period End"
                style={{ marginRight: "50px" }}
                rules={[
                  {
                    required: true,
                    message: "Please input the end date!",
                  },
                ]}
              >
                <DatePicker
                  disabled={validatedHours}
                  placeholder="Enter the end date"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Project"
                name="projectId"
                style={{ width: "80%" }}
                rules={[
                  {
                    required: true,
                    message: "Please input the end date!",
                  },
                ]}
              >
                <Select size="large">
                  {projects.map((item) => (
                    <Select.Option value={item.projectID}>
                      {item.projectName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Billing Amount"
                name="billingAmount"
                style={{ marginLeft: "50px" }}
                rules={[
                  {
                    required: true,
                    message: "Please input the Jira Timesheet Url!",
                  },
                ]}
              >
                <Input
                  disabled={loadingAddUser}
                  className={styles.formInputs}
                  size="large"
                  placeholder="Enter Billing Amount"
                  prefix={
                    <DollarOutlined
                      className="site-form-item-icon"
                      style={{ marginRight: "10px" }}
                    />
                  }
                />
              </Form.Item>
            </div>

            <Form.Item
              name="jiraTimesheetUrl"
              rules={[
                {
                  required: true,
                  message: "Please input the Jira Timesheet Url!",
                },
              ]}
            >
              <Input
                disabled={loadingAddUser}
                className={styles.formInputs}
                placeholder="Enter the Jira Timesheet Url"
                prefix={
                  <IeOutlined
                    className="site-form-item-icon"
                    style={{ marginRight: "10px" }}
                  />
                }
              />
            </Form.Item>
            <Form.Item
              name="teamId"
              rules={[
                {
                  required: true,
                  message: "Please input the Team Id!",
                },
              ]}
            >
              <Input
                disabled={validatedHours}
                className={styles.formInputs}
                placeholder="Enter the Team Id"
                prefix={
                  <KeyOutlined
                    className="site-form-item-icon"
                    style={{ marginRight: "10px" }}
                  />
                }
              />
            </Form.Item>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Form.Item
                name="numberOfHours"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: "Please input the Number Of Hours!",
                  },
                ]}
              >
                <Input
                  disabled={validatedHours}
                  className={styles.formInputs}
                  placeholder="Enter the Number Of Hours"
                  prefix={
                    <ClockCircleOutlined
                      className="site-form-item-icon"
                      style={{ marginRight: "10px" }}
                    />
                  }
                />
              </Form.Item>
              <Button
                style={{ marginLeft: "50px" }}
                size="large"
                htmlType="submit"
                loading={loadingValidate}
                disabled={validatedHours}
                onClick={() => {
                  setAddingUserToTeam(false);
                }}
              >
                Validate Hours
              </Button>
            </div>
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
                {validatedHours ? (
                  <Button
                    style={{ color: "green", borderColor: "green" }}
                    htmlType="submit"
                    disabled={!validatedHours}
                    loading={loadingAddUser}
                  >
                    Confirm
                  </Button>
                ) : (
                  <Tooltip
                    title={"Hours need to be verified to enable creation"}
                  >
                    <Button
                      style={{ color: "green", borderColor: "green" }}
                      htmlType="submit"
                      disabled={!validatedHours}
                      loading={loadingAddUser}
                    >
                      Confirm
                    </Button>
                  </Tooltip>
                )}
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceDetails;
