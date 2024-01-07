import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
const ResourcesModal = (props) => {
  const { isOpen, onClose } = props;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(isOpen);
  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    onClose();
    setOpen(false);
  };
  return (
    <>
      <Modal
        open={open}
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              key="link"
              //  href="https://google.com"
              type="primary"
              loading={loading}
              onClick={handleOk}
              style={{
                background: "red",
                borderColor: "yellow",
              }}
            >
              {" "}
              Delete Resource{" "}
            </Button>

            <div style={{}}>
              <Button key="back" onClick={handleCancel}>
                {" "}
                Cancel{" "}
              </Button>
              ,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleOk}
              >
                {" "}
                Update Resource{" "}
              </Button>
            </div>
          </div>,
        ]}
      >
        {" "}
        <p>Some contents...</p> <p>Some contents...</p> <p>Some contents...</p>{" "}
        <p>Some contents...</p> <p>Some contents...</p>{" "}
      </Modal>{" "}
    </>
  );
};
export default ResourcesModal;
