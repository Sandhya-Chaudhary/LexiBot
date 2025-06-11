import React from "react";
import {Link} from 'react-router-dom'
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import {
    CommentOutlined,     // for chat
    HistoryOutlined,     // for history
    SettingOutlined,     // for settings
    GlobalOutlined,
  } from "@ant-design/icons";

export default function Sidebar(){
    const { Header, Content, Footer, Sider } = Layout;
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    const items =[
        {
            key: "sub1",
            icon: <CommentOutlined />,
            label: <Link to="/">Chat</Link>,

        },
        {
            key: "sub2",
            icon: <HistoryOutlined  />,
            label: <Link to="/history">history</Link>,

        },
        {
            key: "sub3",
            icon: <SettingOutlined />,
            label: <Link to="/setting">Chat Setting</Link>,
            // children: [
            // { key: 9, icon:<GlobalOutlined/>,label: "Language" },
            // ]
        },

    ]
    return (
        <>
        <Sider style={{ background: colorBgContainer }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              items={items}
            />
          </Sider>
        </>
    )
}