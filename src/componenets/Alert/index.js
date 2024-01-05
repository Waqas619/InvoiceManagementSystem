import React, { useEffect } from "react";
import { Button, Modal } from "antd";
const Alert = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const countDown = () => {
    let secondsToGo = 5;
    const instance = modal.success({
      title: props.title,
      content: props.description,
    });

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
    }, secondsToGo * 1000);
  };

  useEffect(() => {});
  return <>{contextHolder}</>;
};
export default Alert;
