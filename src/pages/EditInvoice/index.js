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
  Skeleton,
  Modal,
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
  deleteInvoice,
  getInvoiceByInvoiceId,
  updateInvoice,
  validateJiraHours,
} from "../../services/invoices.services";
import { DateFormater } from "../../utils/helperFunctions";
import { useLocation, useNavigate } from "react-router-dom";
import FileUploader from "../../componenets/FileUploader";
import moment from "moment";

const EditInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [loadingData, setLoadingData] = useState(false);
  const [loadingAddUser, setLoadingAddUser] = useState(false);
  const [loadingValidate, setLoadingValidate] = useState(false);
  const [validatedHours, setValidatedHours] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [file, setFile] = useState([]);
  const [attachmentAvailable, setAttachmentAvailable] = useState(false);
  const [invoiceId, setInvoiceId] = useState();

  const onFinishAddUser = async (values) => {
    if (validatedHours) {
      setLoadingAddUser(true);
      const invoiceForm = new FormData();
      invoiceForm.append("invoice", JSON.stringify(values));
      if (file.length > 0) {
        invoiceForm.append("attachment", file[0]);
      }
      const queryParams = new URLSearchParams(location.search);
      const invoiceId = queryParams.get("id");
      await updateInvoice(
        invoiceId,
        invoiceForm,
        () => {
          setLoadingAddUser(false);
          navigate("/invoices");
        },
        () => {
          setLoadingAddUser(false);
          modal.error({
            title: "Something went wrong! Please try again later",
            centered: true,
          });
        }
      );
    } else {
      setLoadingValidate(true);
      const request = {
        teamId: values.teamId,
        billingStartDate: DateFormater(values.billingStartTime),
        billingEndDate: DateFormater(values.billingEndTime),
        totalHours: values.numberOfHours,
      };
      await validateJiraHours(
        request,
        (data) => {
          setLoadingValidate(false);
          if (data === true) {
            setValidatedHours(true);
            modal.success({
              title: "Validation Passed",
              content: "You can now submit your invoice for approval",
              centered: true,
            });
          } else {
            modal.error({
              title: "Validation Failed",
              content: "Please check the input data and try again",
              centered: true,
            });
          }
        },
        () => {
          modal.error({
            title: "Something went wrong! Please try again later",
            centered: true,
          });
        }
      );
    }
  };

  const loadDetails = async () => {
    await getAllProjects((projectData) => {
      setProjects(projectData);
    });
    const queryParams = new URLSearchParams(location.search);
    const invoiceId = queryParams.get("id");
    setInvoiceId(invoiceId);
    if (invoiceId) {
      setLoadingData(true);
      await getInvoiceByInvoiceId(
        invoiceId,
        (data) => {
          console.log("Date", new Date(data?.billingStartTime));
          form.setFieldsValue({
            invoiceName: data?.invoiceName,
            vendorName: data?.vendorName,
            summary: data?.summary,
            billingStartTime: moment(data?.billingStartTime, "YYYY-MM-DD"),
            billingEndTime: moment(data?.billingEndTime, "YYYY-MM-DD"),
            projectId: data?.projectId,
            billingAmount: data?.billingAmount,
            jiraTimesheetUrl: data?.jiraTimesheetUrl,
            teamId: data?.teamId,
            numberOfHours: data?.numberOfHours,
          });
          if (data?.attachment.length > 0) {
            setAttachmentAvailable(true);
          }
          setLoadingData(false);
        },
        () => {
          setLoadingData(false);
          //Error Case HERE
        }
      );
    }
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    const queryParams = new URLSearchParams(location.search);
    const invoiceId = queryParams.get("id");
    await deleteInvoice(
      invoiceId,
      () => {
        navigate("/invoices");
      },
      () => {}
    );
  };

  const handleFileConfirm = (fileData) => {
    setFile(fileData);
  };

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout>
      {contextHolder}

      <div className={styles.container}>
        <Card
          className={styles.cardContainer}
          bordered
          title={`Edit Invoice`}
          extra={[
            <>
              <Button
                style={{ color: "red", borderColor: "red" }}
                loading={loadingDelete}
                onClick={() => {
                  handleDelete();
                }}
              >
                <DeleteOutlined />
                Delete Invoice
              </Button>
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
                title: `Edit Invoice`,
              },
            ]}
          />
        </Card>
        {loadingData ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <div className={styles.cardContainer}>
            <Form
              form={form}
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
                  <Select size="large" disabled={loadingAddUser}>
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
                  background: "white",
                  border: "1px solid white",
                  borderRadius: "6px",
                  padding: "10px",
                  paddingTop: "5px",
                  marginBottom: "20px",
                }}
              >
                <p style={{ fontSize: "14px" }}>Attachments</p>

                {attachmentAvailable ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <NavLink
                      to={`http://localhost:8080/api/invoices/getAttachment/${invoiceId}`}
                    >
                      Download Attachment
                    </NavLink>
                    <Button
                      style={{ color: "red", borderColor: "red" }}
                      onClick={() => {
                        setAttachmentAvailable(false);
                      }}
                    >
                      Delete Attachment
                    </Button>
                  </div>
                ) : (
                  <FileUploader
                    confirmFile={(data) => {
                      handleFileConfirm(data);
                    }}
                  />
                )}
              </div>

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
                >
                  Validate Hours
                </Button>
              </div>
              <Form.Item>
                <div className={styles.btnContainer}>
                  <Button
                    style={{ color: "red", borderColor: "red" }}
                    onClick={() => {
                      navigate("/Invoices");
                    }}
                  >
                    Back
                  </Button>
                  <Tooltip
                    title={`${
                      validatedHours
                        ? "Hours have been sucessfully validated, Submission is now possible"
                        : "Hours need to be verified to enable creation"
                    }`}
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
                </div>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditInvoice;
