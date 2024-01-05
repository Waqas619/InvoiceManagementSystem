import React from "react";
import { Button } from "antd";

const CustomButton = (props) => {
  const {
    text = "Submit",
    onClick = () => {},
    isLoading = false,
    customStyle = {},
  } = props;
  return (
    <Button
      disabled={isLoading}
      onClick={() => {
        onClick();
      }}
      style={{ ...customStyle }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
