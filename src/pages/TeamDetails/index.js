import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, Modal, Breadcrumb, Skeleton } from "antd";
import Layout from "../../componenets/Layout";
import { useLocation, NavLink } from "react-router-dom";
import styles from "./index.module.css";
import { UserOutlined, MailOutlined, DeleteOutlined } from "@ant-design/icons";
import Table from "../../componenets/Table";
import {
  deleteTeam,
  getTeamsByTeamID,
  addTeam,
  updateTeam,
  getTeamsDepartments,
} from "../../services/teams.services";
import { getAllProjects } from "../../services/projects.services";
import { getAllUsers, getAllUserRoles } from "../../services/users.services";
import { useNavigate } from "react-router-dom/dist";
import ResourcesModal from "../../componenets/ResourcesModal";

const TeamDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadingData, setLoadingData] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [projects, setProjects] = useState([]);
  const [teamMemberDepartments, setTeamMemberDepartments] = useState([]);
  const [teamsData, setTeamsData] = useState();
  const [loadingAddTeam, setLoadingAddTeam] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [modal, contextHolder] = Modal.useModal();
  const [resourceModal, setResourceModal] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(0);
  const [modalMode, setModalMode] = useState("");
  const [userList, setUserList] = useState([]);
  const [userRoles, setUserRoles] = useState([]);

  const handleDelete = async () => {
    setLoadingDelete(true);
    const queryParams = new URLSearchParams(location.search);
    const invoiceId = queryParams.get("id");
    await deleteTeam(
      invoiceId,
      () => {
        setLoadingDelete(false);
        modal.success({
          title: "Team Deletion",
          content: "Team Deleted Successfully.",
        });
        setTimeout(() => {
          navigate("/Teams");
        }, 2000);
      },
      () => {
        setLoadingDelete(false);
      }
    );
  };

  const onFinishAddTeam = async (values) => {
    setLoadingAddTeam(true);
    const queryParams = new URLSearchParams(location.search);
    const teamId = queryParams.get("id");
    console.log("teams", values);
    let body = {
      teamName: values.teamName,
      teamId: teamId || null,
      teamIdentificationCode: values.teamIdentificationCode,
      numberOfResources: 0,
      isActive: true,
      teamMembers: teamsData ? teamsData.teamMembers : [],
    };
    if (teamId) {
      await updateTeam(
        teamId,
        body,
        () => {
          setLoadingAddTeam(false);
          modal.success({
            title: "Team Updation",
            content: "Team Updated Successfully.",
          });
          setTimeout(() => {
            navigate("/Teams");
          }, 2000);
        },
        (error) => {
          console.log("error", error);
          if (error.response.status === 403) {
            modal.error({
              title: "Update Team Operation Failed",
              content: error.response.data.message,
            });
          } else {
            modal.error({
              title: "Update Team Operation Failed",
              content: "Something Went Wrong. Please Try Again Later!",
            });
          }
          setLoadingAddTeam(false);
        }
      );
    } else {
      await addTeam(
        body,
        () => {
          setLoadingAddTeam(false);
          modal.success({
            title: "Team Addition",
            content: "Team Added Successfully.",
          });
          setTimeout(() => {
            navigate("/Teams");
          }, 2000);
        },
        (error) => {
          console.log("error", error);
          modal.error({
            title: "Add Team Operation Failed",
            content: "Something Went Wrong. Please Try Again Later!",
          });
          setLoadingAddTeam(false);
        }
      );
    }
  };

  const loadDetails = async () => {
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
            setTeamsData(data);
            setLoadingData(false);
          },
          (error) => {
            setLoadingData(false);
            console.log("getTeamsByTeamId error", error);
            modal.error({
              title: "Something Went Wrong. Please Try Again Later!",
              centered: true,
            });
          }
        );
      }
    }
    await getAllProjects(
      (projectData) => {
        setProjects(projectData);
      },
      (error) => {
        console.log("error", error);
        modal.error({
          title: "Something Went Wrong. Unable to Fetch Projects.",
          centered: true,
        });
      }
    );
    await getTeamsDepartments(
      (departments) => {
        setTeamMemberDepartments(departments);
      },
      (error) => {
        console.log("error", error);
        modal.error({
          title: "Something went Wrong. Unable to Fetch Team Departments.",
          centered: true,
        });
      }
    );
    await getAllUsers(
      (userData) => {
        setUserList(userData);
      },
      (error) => {
        console.log("error", error);
        modal.error({
          title: "Something went Wrong. Unable to Fetch Users List.",
          centered: true,
        });
      }
    );

    await getAllUserRoles(
      (usrRole) => {
        setUserRoles(usrRole);
      },
      (error) => {
        console.log("error", error);
        modal.error({
          title: "Something went Wrong. Unable to Fetch Users Roles.",
          centered: true,
        });
      }
    );
  };

  const handleDetails = (id) => {
    console.log("tid", id);
    setSelectedResourceId(id);
    setResourceModal(true);
    setModalMode("Edit");
  };

  const filterProjectNames = (projectsList) => {
    const filterProjectNames = projectsList.map(
      (project) => project.projectName
    );
    console.log("filterProjectNames", filterProjectNames);
    return filterProjectNames;
  };

  const generateTableData = (tableData) => {
    const temp = tableData.map((item, index) => {
      return {
        ID: index + 1,
        teamMemberName: item.teamMemberName,
        teamMemberDepartment: item.teamMemberDepartment,
        Projects: {
          name: "Projects",
          data: filterProjectNames(item.projects),
        },
        Action: {
          name: "Modify Resource",
          Id: index,
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

  const closeResourceModalStatus = () => {
    setResourceModal(false);
  };
  const removeResource = () => {
    const updatedteamMembers = teamsData?.teamMembers.filter(
      (element, index) => index !== selectedResourceId
    );
    setTeamsData({ ...teamsData, teamMembers: updatedteamMembers });
    setResourceModal(false);
    generateTableData(updatedteamMembers);
  };

  const addResource = (resourceData) => {
    let updatedteamMembers = teamsData ? teamsData.teamMembers : [];
    let member = {
      isActive: true,
      roleName: resourceData.roleName,
      projects: getProjectsObjectByProjectID(resourceData.projectID),
      teamMemberDepartment: resourceData.teamMemberDepartment,
      teamMemberEmailAddress: resourceData.teamMemberEmailAddress,
      teamMemberId: null,
      // here team member name is actually jiraUserAccountId
      teamMemberJiraAccountId: resourceData.teamMemberName,
      teamMemberName: getUserNameByUserId(resourceData.teamMemberName),
    };
    updatedteamMembers.push(member);
    console.log("updatedteamMembers", updatedteamMembers);
    setTeamsData({ ...teamsData, teamMembers: updatedteamMembers });
    setResourceModal(false);
    generateTableData(updatedteamMembers);
  };

  const updateResource = (resourceData) => {
    let updatedteamMembers = teamsData?.teamMembers;
    let member = {
      isActive: true,
      roleName: resourceData.roleName,
      projects: getProjectsObjectByProjectID(resourceData.projectID),
      teamMemberDepartment: resourceData.teamMemberDepartment,
      teamMemberEmailAddress: resourceData.teamMemberEmailAddress,
      // here team member name is actually jiraUserAccountId
      teamMemberJiraAccountId: resourceData.teamMemberName,
      teamMemberName: getUserNameByUserId(resourceData.teamMemberName),
      teamMemberId: updatedteamMembers[selectedResourceId].teamMemberId,
    };
    updatedteamMembers[selectedResourceId] = member;
    console.log("updatedteamMembers", updatedteamMembers);
    setTeamsData({ ...teamsData, teamMembers: updatedteamMembers });
    setResourceModal(false);
    generateTableData(updatedteamMembers);
  };

  const getUserNameByUserId = (userId) => {
    const user = userList.find((usr) => usr.jiraUserAccountId === userId);
    return user.jiraUserAccountName;
  };

  const getProjectsObjectByProjectID = (projectIDs) => {
    const filteredProjects = projects.filter((prj) =>
      projectIDs.includes(prj.projectID)
    );
    console.log("final projects", filteredProjects);
    return filteredProjects;
  };

  return (
    <Layout>
      {contextHolder}
      <ResourcesModal
        isOpen={resourceModal}
        onClose={closeResourceModalStatus}
        formData={teamsData?.teamMembers[selectedResourceId]}
        projects={projects}
        userList={userList}
        userRoles={userRoles}
        teamMemberDepartments={teamMemberDepartments}
        modalType={modalMode}
        onAddResource={(resourceData) => {
          addResource(resourceData);
        }}
        onRemoveResource={() => {
          removeResource();
        }}
        onUpdateResource={(resourceData) => {
          updateResource(resourceData);
        }}
      ></ResourcesModal>
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
                  style={{
                    color: "green",
                    borderColor: "green",
                    marginRight: "20px",
                  }}
                  htmlType="submit"
                  loading={loadingAddTeam}
                >
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
          <Card className={styles.cardContainer}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "40px",
                color: "#333",
                textTransform: "uppercase",
                letterSpacing: "2px",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              Resource List
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setModalMode("Add");
                  setResourceModal(true);
                }}
                key="sider-menuitem-delete"
                style={{
                  marginBottom: "10px",
                }}
              >
                Add Resource
              </Button>
            </div>
            <Table data={tableData} />
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default TeamDetails;
