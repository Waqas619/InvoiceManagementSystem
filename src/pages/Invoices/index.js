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
        Status: item.status,
        startDate: moment(item.billingStartTime).format("MMMM Do YYYY"),
        endDate: moment(item.billingEndTime).format("MMMM Do YYYY"),
        Action: {
          name: "View Details",
          Id: item.invoiceId,
          status: item.status,
          handleClick: (id, status) => {
            handleDetails(id, status);
          },
        },
      };
    });
    setLoading(false);
    setTableData(temp);
  };

  const handleDetails = (id, status) => {
    const user = getItem("user");

    if (
      user.role === "Partner" &&
      (status === "NEED_CLARIFICATION" || status === "REJECT")
    ) {
      navigate(`/EditInvoice?id=${id}`);
    } else {
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
        setLoading(false);
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
            <Table data={tableData} />
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Invoices;
