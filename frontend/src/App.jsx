import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import {Layout} from 'antd'


import Router from "./Router/Router";
import Sidebar from "./Components/Header";




function App() {
  const { Content } = Layout;
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout style={{ marginLeft: 200 }}>
          <Content style={{ margin: "16px", padding: "24px", background: "#fff" }}>
            <Router />
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
