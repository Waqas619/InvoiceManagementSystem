import React, { useEffect, useState } from "react";
import Layout from "../../componenets/Layout";
import { Card, Button, Skeleton, Modal } from "antd";

import Table from "../../componenets/Table";
import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { getAllTeams } from "../../services/teams.services";

const Teams = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  const generateTableData = (data) => {
    const temp = data.map((item) => {
      return {
        ID: item.teamId,
        teamName: item.teamName,
        teamIdentificationCode: item.teamIdentificationCode,
        numberOfResources: item.numberOfResources,
        Action: {
          name: "View Details",
          Id: item.teamId,
          handleClick: (id) => {
            handleDetails(id);
          },
        },
      };
    });
    setLoading(false);
    setTableData(temp);
  };

  const handleDetails = (id) => {
    if (typeof id === "number") {
      navigate(`/TeamDetails?id=${id}`);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await getAllTeams(
      (data) => {
        generateTableData(data);
      },
      () => {
        modal.error({
          title: "Something went wrong! Please try again later",
          centered: true,
        });
      }
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      {contextHolder}
      <div className={styles.container}>
        <Card
          className={styles.cardContainer}
          bordered
          title="Team Management"
          extra={
            <Button
              onClick={() => {
                navigate("/TeamDetails");
              }}
              key="sider-menuitem-delete"
              style={{
                marginRight: "20px",
                marginLeft: "auto",
                marginBottom: "10px",
              }}
            >
              Add Team
            </Button>
          }
        >
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <>{tableData.length > 0 && <Table data={tableData} />}</>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Teams;
