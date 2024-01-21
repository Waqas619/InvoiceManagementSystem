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
  Skeleton,
  Modal,
} from "antd";
import {
  UserOutlined,
  KeyOutlined,
  IeOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import styles from "./index.module.css";
import {
  getInvoiceByInvoiceId,
  updateInvoiceStatus,
} from "../../services/invoices.services";
import { useLocation, useNavigate } from "react-router-dom";

const InvoiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [remarksForm] = Form.useForm();
  const user = getItem("user");
  const [modal, contextHolder] = Modal.useModal();

  const [loadingData, setLoadingData] = useState(false);

  const [attachmentAvailable, setAttachmentAvailable] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const [loadingStatus, setLoadingStatus] = useState({
    APPROVE: false,
    NEED_CLARIFICATION: false,
    REJECT: false,
  });

  const loadDetails = async () => {
    const queryParams = new URLSearchParams(location.search);
    const invoiceId = queryParams.get("id");
    setInvoiceId(invoiceId);
    if (invoiceId) {
      setLoadingData(true);
      await getInvoiceByInvoiceId(
        invoiceId,
        (data) => {
          form.setFieldsValue({
            invoiceName: data?.invoiceName,
            vendorName: data?.vendorName,
            summary: data?.summary,
            billingStartTime: data?.billingStartTime,
            billingEndTime: data?.billingEndTime,
            projectId: data?.projectId,
            billingAmount: data?.billingAmount,
            jiraTimesheetUrl: data?.jiraTimesheetUrl,
            teamId: data?.teamId,
            numberOfHours: data?.numberOfHours,
            remarks: data?.remarks,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout>
      {contextHolder}

      <div className={styles.container}>
        <Card
          className={styles.cardContainer}
          bordered
          title={`Invoice Details`}
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
                title: "Invoice Details",
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
                    disabled={true}
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
                    disabled={true}
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
                  disabled={true}
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
                  {invoiceId ? (
                    <Input disabled={true} className={styles.formInputs} />
                  ) : (
                    <DatePicker
                      disabled={true}
                      placeholder="Enter the start date"
                      size="large"
                    />
                  )}
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
                  {invoiceId ? (
                    <Input disabled={true} className={styles.formInputs} />
                  ) : (
                    <DatePicker
                      disabled={true}
                      placeholder="Enter the end date"
                      size="large"
                    />
                  )}
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
                  <Select size="large" disabled={true}></Select>
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
                    disabled={true}
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
                  disabled={true}
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
                  disabled={true}
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
              </div>

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
                  disabled={true}
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
              <Form.Item
                name="remarks"
                label="Remarks"
                style={{ width: "100%" }}
              >
                <Input disabled={true} className={styles.formInputs} />
              </Form.Item>
            </Form>
            {(user.role === "Team_Lead" ||
              user.role === "Product_Owner" ||
              user.role === "Portfolio_Owner") && (
              <Form
                form={remarksForm}
                layout="vertical"
                className={styles.formContainer}
                initialValues={{
                  remember: true,
                }}
              >
                <Form.Item
                  name="remarks"
                  label="Add Remarks"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter your remarks before updating the status!",
                    },
                  ]}
                >
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
                        Needs Clarification
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
