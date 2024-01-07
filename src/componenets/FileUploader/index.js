import React, { useState } from "react";
import { InboxOutlined, FileOutlined, DeleteOutlined } from "@ant-design/icons";
import { message, Upload, Button } from "antd";
import styles from "./index.module.css";
const { Dragger } = Upload;

const FileUploader = ({ confirmFile }) => {
  const [filesList, setFilesList] = useState([]);
  const [confirmedFile, setConfirmedFile] = useState(false);
  let tempList = [];

  const checkFile = (file) => {
    const acceptedExtensions = ["pdf"];
    const fileExtension = file.name.split(".").pop();
    if (!acceptedExtensions.includes(fileExtension.toLowerCase())) {
      message.error("You can only upload a PDF file!");
      return false;
    } else {
      tempList.push(file);
      setFilesList(tempList);
    }
    return true;
  };

  const handleFileUpload = async () => {
    confirmFile(filesList);
    setConfirmedFile(true);
  };

  const properties = {
    name: "file",
    multiple: true,
    customRequest: () => {},
    onChange(info) {},
    onDrop(e) {},
    beforeUpload: checkFile,
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      {!confirmedFile && (
        <Dragger
          {...properties}
          showUploadList={false}
          multiple={false}
          disabled={confirmedFile}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: "black" }} />
          </p>
          <p className="ant-upload-text">
            Click or drag a PDF file to this area to upload
          </p>
        </Dragger>
      )}
      {filesList.map((item) => (
        <div className={styles.listContainer} key={item.name}>
          <div className={styles.listNameContainer}>
            <FileOutlined />
            <p>{item.name}</p>
          </div>
          <Button
            onClick={() => {
              setFilesList([]);
              setConfirmedFile(false);
            }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ))}
      {!confirmedFile && (
        <div className={styles.btnContainer}>
          <Button
            style={{ color: "red", borderColor: "red" }}
            onClick={() => {
              setFilesList([]);
              setConfirmedFile(false);
            }}
          >
            Clear File Selection
          </Button>
          <Button
            style={{ color: "green", borderColor: "green" }}
            onClick={handleFileUpload}
            disabled={confirmedFile && filesList.length > 0}
          >
            Confirm File Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
