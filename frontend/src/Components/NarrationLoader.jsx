import React from "react";
import { LoadingOutlined, PauseOutlined } from "@ant-design/icons";

import { Flex, Spin, Button } from "antd";

export default function NarrationLoader({ onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // semi-transparent white overlay
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        onClick={onCancel}
        type="primary"
        shape="circle"
        icon={<PauseOutlined />}
        size="large"
        style={{
          marginBottom: "1rem",
          backgroundColor: "#ff4d4f",
          borderColor: "#ff4d4f",
        }}
      />
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  );
}
