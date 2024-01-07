import React, { useEffect, useState } from "react";
import Layout from "../../componenets/Layout";
import { Card, Button, Skeleton, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import Table from "../../componenets/Table";
import { getAllInvoices } from "../../services/invoices.services";
import moment from "moment";
import { getItem } from "../../utils/storage";
const Invoices = () => {
  const user = getItem("user");
  const [modal, contextHolder] = Modal.useModal();

  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateTableData = (data) => {
    const temp = data.map((item) => {
      return {
        Id: item.invoiceId,
        Name: item.invoiceName,
        vendorName: item.vendorName,
        Project: item.projectName,
        amount: item.billingAmount,
        startDate: moment(item.billingStartTime).format("MMMM Do YYYY"),
        endDate: moment(item.billingEndTime).format("MMMM Do YYYY"),
        Action: {
          name: "View Details",
          Id: item.invoiceId,
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
      navigate(`/InvoiceDetails?id=${id}`);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await getAllInvoices(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout>
      {contextHolder}
      <div className={styles.container}>
        <Card
          className={styles.cardContainer}
          bordered
          title="Invoice Management"
          extra={
            <>
              {user.role === "Partner" && (
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
              )}
            </>
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
