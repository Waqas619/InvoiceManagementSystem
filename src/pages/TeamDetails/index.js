import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, Modal, Breadcrumb, Skeleton } from "antd";
import Layout from "../../componenets/Layout";
import { useLocation } from "react-router-dom";
import styles from "./index.module.css";
import { NavLink } from "react-router-dom";
import { UserOutlined, MailOutlined, DeleteOutlined } from "@ant-design/icons";
import Table from "../../componenets/Table";
import { deleteTeam, getTeamsByTeamID } from "../../services/teams.services";
import { getAllProjects } from "../../services/projects.services";
import { useNavigate } from "react-router-dom/dist";

const TeamDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadingData, setLoadingData] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingAddTeam, setLoadingAddTeam] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [modal, contextHolder] = Modal.useModal();

  const handleDelete = async () => {
    setLoadingDelete(true);
    const queryParams = new URLSearchParams(location.search);
    const invoiceId = queryParams.get("id");
    await deleteTeam(
      invoiceId,
      () => {
        navigate("/Teams");
      },
      () => {}
    );
  };

  const onFinishAddTeam = async (values) => {
    // if (validatedHours) {
    //   setLoadingAddUser(true);
    //   const formData = new FormData();
    //   const temp = Object.keys(values);
    //   temp.map((item) => {
    //     formData.append(`${item}`, values[item]);
    //   });
    //   const invoiceForm = new FormData();
    //   invoiceForm.append("invoice", JSON.stringify(values));
    //   const queryParams = new URLSearchParams(location.search);
    //   const invoiceId = queryParams.get("id");
    //   if (invoiceId) {
    //     await updateInvoice(
    //       invoiceId,
    //       invoiceForm,
    //       () => {
    //         setLoadingAddUser(false);
    //         setAddingUserToTeam(false);
    //         navigate("/invoices");
    //       },
    //       () => {}
    //     );
    //   } else {
    //     await createInvoice(
    //       invoiceForm,
    //       () => {
    //         setLoadingAddUser(false);
    //         setAddingUserToTeam(false);
    //         navigate("/invoices");
    //       },
    //       () => {}
    //     );
    //   }
    // } else {
    //   setLoadingValidate(true);
    //   const request = {
    //     teamId: values.teamId,
    //     billingStartDate: DateFormater(values.billingStartTime),
    //     billingEndDate: DateFormater(values.billingEndTime),
    //     totalHours: values.numberOfHours,
    //   };
    //   await validateJiraHours(
    //     request,
    //     (data) => {
    //       setLoadingValidate(false);
    //       if (data === true) {
    //         setValidatedHours(true);
    //         modal.success({
    //           title: "Validation Passed",
    //           content: "You can now submit your invoice for approval",
    //           centered: true,
    //         });
    //       } else {
    //         modal.error({
    //           title: "Validation Failed",
    //           content: "Please check the input data and try again",
    //           centered: true,
    //         });
    //       }
    //     },
    //     () => {
    //       modal.error({
    //         title: "Something went wrong! Please try again later",
    //         centered: true,
    //       });
    //     }
    //   );
    // }
  };

  const loadDetails = async () => {
    await getAllProjects((projectData) => {
      setProjects(projectData);
    });
    if (window.location.pathname.includes("/TeamDetails")) {
      const queryParams = new URLSearchParams(location.search);
      const teamId = queryParams.get("id");
      if (teamId) {
        setLoadingData(true);
        await getTeamsByTeamID(
          teamId,
          (data) => {
            form.setFieldsValue({
              teamName: data?.teamName,
              teamIdentificationCode: data?.teamIdentificationCode,
            });
            generateTableData(data.teamMembers);
            setLoadingData(false);
          },
          (error) => {
            setLoadingData(false);
            console.log("getTeamsByTeamId error", error);
            modal.error({
              title: "Something went wrong! Please try again later",
              centered: true,
            });
          }
        );
      }
    }
  };

  const handleDetails = (id) => {
    if (typeof id === "number") {
      navigate(`/TeamDetails?id=${id}`);
    }
  };

  const filterProjectNames = (projectsList) => {
    const filterProjectNames = projectsList.map(
      (project) => project.projectName
    );
    console.log("filterProjectNames", filterProjectNames);
    return filterProjectNames;
  };

  const generateTableData = (data) => {
    const temp = data.map((item, index) => {
      return {
        ID: index + 1,
        teamMemberName: item.teamMemberName,
        teamMemberDepartment: item.teamMemberDepartment,
        //   projects: filterProjectNames(item.projects),
        Projects: {
          name: "Projects",
          data: filterProjectNames(item.projects),
        },
        Action: {
          name: "View Details",
          Id: item.teamId,
          handleClick: (id) => {
            handleDetails(id);
          },
        },
      };
    });
    setTableData(temp);
  };

  useEffect(() => {
    loadDetails();
  }, []);

  return (
    <Layout>
      {contextHolder}
      <Card
        className={styles.cardContainer}
        bordered
        title={`${
          window.location.pathname === "/TeamDetails"
            ? "Team Details"
            : "Add Team"
        }`}
        extra={[
          <>
            {window.location.pathname === "/TeamDetails" && (
              <Button
                style={{ color: "red", borderColor: "red" }}
                loading={loadingDelete}
                onClick={() => {
                  handleDelete();
                }}
              >
                <DeleteOutlined />
                Delete Team
              </Button>
            )}
          </>,
        ]}
      >
        <Breadcrumb
          items={[
            {
              title: (
                <NavLink to="/Teams">
                  <span>Team Management</span>
                </NavLink>
              ),
            },

            {
              title: `${
                window.location.pathname === "/TeamDetails"
                  ? "Team Details"
                  : "Add Team"
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
            onFinish={onFinishAddTeam}
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
                disabled={loadingAddTeam}
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
                disabled={loadingAddTeam}
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
              <div className={styles.btnContainer}>
                <Button
                  style={{ color: "red", borderColor: "red" }}
                  onClick={() => {
                    navigate("/Teams");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  style={{ color: "green", borderColor: "green" }}
                  htmlType="submit"
                  loading={loadingAddTeam}
                >
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
          <Card className={styles.cardContainer}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  console.log("123");
                }}
                key="sider-menuitem-delete"
                style={{
                  marginBottom: "10px",
                }}
              >
                Add Resource
              </Button>
            </div>
            {tableData.length > 0 && <Table data={tableData} />}
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default TeamDetails;
