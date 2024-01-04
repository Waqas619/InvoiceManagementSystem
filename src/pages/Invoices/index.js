import React, { useEffect, useState } from "react";
import Layout from "../../componenets/Layout";
import { Card, Button, Skeleton } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./index.module.css";
import Table from "../../componenets/Table";
import { getAllInvoices } from "../../services/invoices.services";
import moment from "moment";

const Invoices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateTableData = (data) => {
    const temp = data.map((item) => {
      return {
        ID: item.invoiceId,
        Name: item.invoiceName,
        vendorName: item.vendorName,
        Project: item.projectName,
        amount: item.billingAmount,
        startDate: moment(item.billingStartTime).format("MMMM Do YYYY"),
        endDate: moment(item.billingEndTime).format("MMMM Do YYYY"),
      };
    });
    console.log("Checking Temp", temp);
    setLoading(false);
    setTableData(temp);
  };

  const loadData = async () => {
    setLoading(true);
    const data = await getAllInvoices();
    console.log("Checking response", data);
    debugger;
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
          title="Invoice Management"
          extra={
            <Button
              onClick={() => {
                navigate("/AddInvoice");
              }}
              key="sider-menuitem-delete"
              style={{
                marginRight: "20px",
                marginLeft: "auto",
                marginBottom: "10px",
              }}
            >
              Add Invoice
            </Button>
          }
        >
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <>{tableData.length > 1 && <Table data={tableData} />}</>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Invoices;
