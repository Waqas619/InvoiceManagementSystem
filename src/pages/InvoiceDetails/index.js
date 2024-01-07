import React, { useEffect, useState } from "react";
import Layout from "../../componenets/Layout";
import { getItem } from "../../utils/storage";
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
  createInvoice,
  deleteInvoice,
  downloadInvoice,
  getInvoiceByInvoiceId,
  updateInvoice,
  updateInvoiceStatus,
  validateJiraHours,
} from "../../services/invoices.services";
import { DateFormater } from "../../utils/helperFunctions";
import { useLocation, useNavigate } from "react-router-dom";
import FileUploader from "../../componenets/FileUploader";

const InvoiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [remarksForm] = Form.useForm();
  const user = getItem("user");
  const [modal, contextHolder] = Modal.useModal();

  const [loadingData, setLoadingData] = useState(false);
  const [addUserToTeam, setAddingUserToTeam] = useState(false);
  const [loadingAddUser, setLoadingAddUser] = useState(false);
  const [loadingValidate, setLoadingValidate] = useState(false);
  const [validatedHours, setValidatedHours] = useState(false);
  const [projects, setProjects] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [file, setFile] = useState([]);
  const [attachmentAvailable, setAttachmentAvailable] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const [loadingStatus, setLoadingStatus] = useState({
    APPROVE: false,
    NEED_CLARIFICATION: false,
    REJECT: false,
  });

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
      if (invoiceId) {
        await updateInvoice(
          invoiceId,
          invoiceForm,
          () => {
            setLoadingAddUser(false);
            setAddingUserToTeam(false);
            navigate("/invoices");
          },
          () => {}
        );
      } else {
        await createInvoice(
          invoiceForm,
          () => {
            setLoadingAddUser(false);
            setAddingUserToTeam(false);
            navigate("/invoices");
          },
          () => {}
        );
      }
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
    if (window.location.pathname.includes("/InvoiceDetails")) {
      const queryParams = new URLSearchParams(location.search);
      const invoiceId = queryParams.get("id");
      setInvoiceId(invoiceId);
      if (invoiceId) {
        setLoadingData(true);
        await getInvoiceByInvoiceId(
          invoiceId,
          (data) => {
            form.setFieldsValue({
              ["invoiceName"]: data?.invoiceName,
              ["vendorName"]: data?.vendorName,
              ["summary"]: data?.summary,
              // ["billingStartTime"]: new Date(data?.billingStartTime),
              // ["billingEndTime"]: new Date(data?.billingEndTime),
              ["projectId"]: data?.projectId,
              ["billingAmount"]: data?.billingAmount,
              ["jiraTimesheetUrl"]: data?.jiraTimesheetUrl,
              ["teamId"]: data?.teamId,
              ["numberOfHours"]: data?.numberOfHours,
            });
            if (data?.attachment.length > 0) {
              setAttachmentAvailable(true);
            }
            setLoadingData(false);
            if (
              user.role === "Partner" &&
              (data.status === "REJECT" || data.status === "NEED_CLARIFICATION")
            ) {
              setViewMode(false);
            } else {
              setViewMode(true);
            }
          },
          () => {
            setLoadingData(false);
            //Error Case HERE
          }
        );
      }
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

  const updateStatus = async (data) => {
    setLoadingStatus({ ...loadingStatus, [data]: true });
    const remarks = remarksForm.getFieldValue(["remarks"]);
    const queryParams = new URLSearchParams(location.search);
    const invoiceId = queryParams.get("id");
    updateInvoiceStatus(
      invoiceId,
      data,
      {
        remarks: remarks,
      },
      () => {
        navigate("/Invoices");
      },
      () => {}
    );
  };
  useEffect(() => {
    loadDetails();
  }, []);
  return (
    <Layout>
      {contextHolder}

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
              {window.location.pathname === "/InvoiceDetails" &&
                (user.role === "Admin" || user.role === "Partner") && (
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
                    disabled={loadingAddUser || viewMode}
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
                    disabled={loadingAddUser || viewMode}
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
                  disabled={loadingAddUser || viewMode}
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
                    disabled={validatedHours || viewMode}
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
                    disabled={validatedHours || viewMode}
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
                  <Select size="large" disabled={loadingAddUser || viewMode}>
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
                    disabled={loadingAddUser || viewMode}
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
                  disabled={loadingAddUser || viewMode}
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
                  disabled={validatedHours || viewMode}
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
                {!viewMode ? (
                  <FileUploader
                    confirmFile={(data) => {
                      handleFileConfirm(data);
                    }}
                  />
                ) : (
                  <>
                    {attachmentAvailable ? (
                      <NavLink
                        to={`http://localhost:8080/api/invoices/getAttachment/${invoiceId}`}
                      >
                        Download Attachment
                      </NavLink>
                    ) : (
                      <p>No file has been attached with this invoice</p>
                    )}
                  </>
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
                    disabled={validatedHours || viewMode}
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
                {!viewMode && (
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
                )}
              </div>
              {!viewMode && (
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
              )}
            </Form>
            {viewMode &&
              (user.role === "Team_Lead" || user.role === "Management") && (
                <Form
                  form={remarksForm}
                  layout="vertical"
                  className={styles.formContainer}
                  initialValues={{
                    remember: true,
                  }}
                >
                  <Form.Item name="remarks">
                    <Input
                      className={styles.formInputs}
                      placeholder="Remarks/Comments"
                      disabled={
                        loadingStatus.APPROVE ||
                        loadingStatus.NEED_CLARIFICATION ||
                        loadingStatus.REJECT
                      }
                      prefix={
                        <KeyOutlined
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
                          navigate("/Invoices");
                        }}
                        disabled={
                          loadingStatus.APPROVE ||
                          loadingStatus.NEED_CLARIFICATION ||
                          loadingStatus.REJECT
                        }
                      >
                        Back
                      </Button>
                      <div>
                        <Button
                          style={{ color: "green", borderColor: "green" }}
                          disabled={
                            loadingStatus.APPROVE ||
                            loadingStatus.NEED_CLARIFICATION ||
                            loadingStatus.REJECT
                          }
                          onClick={() => {
                            updateStatus("NEED_CLARIFICATION");
                          }}
                          loading={loadingStatus.NEED_CLARIFICATION}
                        >
                          Needs Calrification
                        </Button>{" "}
                        <Button
                          style={{ color: "red", borderColor: "red" }}
                          onClick={() => {
                            updateStatus("REJECT");
                          }}
                          disabled={
                            loadingStatus.APPROVE ||
                            loadingStatus.NEED_CLARIFICATION ||
                            loadingStatus.REJECT
                          }
                          loading={loadingStatus.REJECT}
                        >
                          Reject
                        </Button>{" "}
                        <Button
                          style={{ color: "green", borderColor: "green" }}
                          htmlType="submit"
                          onClick={() => {
                            updateStatus("APPROVE");
                          }}
                          disabled={
                            loadingStatus.APPROVE ||
                            loadingStatus.NEED_CLARIFICATION ||
                            loadingStatus.REJECT
                          }
                          loading={loadingStatus.APPROVE}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </Form.Item>
                </Form>
              )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceDetails;
