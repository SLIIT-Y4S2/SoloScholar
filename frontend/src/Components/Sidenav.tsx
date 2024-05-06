import React, { useState } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import Lecture from './Lecture';
const { Title } = Typography;

const { Header, Content, Sider } = Layout;


const backendData = [
    { id: 'Lecture 1', name: 'Lecture 1' },
    { id: 'Lecture 2', name: 'Lecture 2' },
    { id: 'Lecture 3', name: 'Lecture 3' },
];

const backendDataTutorials = [
    { id: 'Tutorial 1', name: 'Tutorial 1' },
    { id: 'Tutorial 2', name: 'Tutorial 2' },
    { id: 'Tutorial 3', name: 'Tutorial 3' },
];

const backendDataLabs = [
    { id: 'Lab 1', name: 'Lab 1' },
    { id: 'Lab 2', name: 'Lab 2' },
    { id: 'Lab 3', name: 'Lab 3' },
];

const items3: MenuProps['items'] = [
    {
        key: 'learning-outcomes',
        label: 'Learning Outcomes',
    },
    {
        key: 'Lectures',
        label: 'Lectures',
        children: backendData.map((item) => ({
            key: item.id,
            label: item.name,
        })),
    },
    {
        key: 'tutorials',
        label: 'Tutorials',
        children: backendDataTutorials.map((item) => ({
            key: item.id,
            label: item.name,
        })),
    },
    {
        key: 'labs',
        label: 'Labs',
        children: backendDataLabs.map((item) => ({
            key: item.id,
            label: item.name,
        })),
    },
];

const SideNav: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [selectedMenuItem, setSelectedMenuItem] = useState<string>('1');

    const handleMenuItemClick = (key: string) => {
        setSelectedMenuItem(key);
    };

    const items: MenuProps['items'] = [...items3];

    // Define a variable to hold the selected component
    type LectureProps = {
        title: string;
        duration: number;
        selectedMenuItem: string; // Add the selectedMenuItem prop
    };

    let selectedComponent: React.ReactNode;

    // Set the selected component based on the menu item clicked
    switch (selectedMenuItem) {
        case '1':
            selectedComponent = <Lecture title="Sample Lecture" duration={60} selectedMenuItem={selectedMenuItem} />;
            break;
        case '2':
            selectedComponent = <Lecture title="Sample Lecture" duration={60} selectedMenuItem={selectedMenuItem} />;
            break;
        case '3':
            selectedComponent = <Lecture title="Sample Lecture" duration={60} selectedMenuItem={selectedMenuItem} />;
            break;
        case '4':
            selectedComponent = <Lecture title="Sample Lecture" duration={60} selectedMenuItem={selectedMenuItem} />;
            break;
        default:
            selectedComponent = null;
    }

    return (
        <Layout>
            <Layout>
                <Sider width={350} style={{ background: colorBgContainer }}>
                    {/* Existing code... */}
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0, padding: '50px' }}
                        items={items}
                        onClick={({ key }) => handleMenuItemClick(key)}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px', background: '#F6F6F6' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Modules</Breadcrumb.Item>
                        <Breadcrumb.Item>Module 1</Breadcrumb.Item>
                        <Breadcrumb.Item>{`${selectedMenuItem}`}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {/* Render the selected component */}
                        {selectedComponent}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default SideNav;