import React, { useEffect, useState } from "react";
import Layout from "../../componenets/Layout";
import { Card, Button, Skeleton } from "antd";

import Table from "../../componenets/Table";
import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { getAllTeams } from "../../services/teams.services";

const Teams = () => {
  const nav = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

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
            console.log("ID", id);
          },
        },
      };
    });
    setLoading(false);
    setTableData(temp);
  };

  const loadData = async () => {
    setLoading(true);
    const data = await getAllTeams();
    console.log("Checking response", data);
    generateTableData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <Card
          className={styles.cardContainer}
          bordered
          title="Team Management"
          extra={
            <Button
              onClick={() => {
                nav("/TeamDetails");
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
