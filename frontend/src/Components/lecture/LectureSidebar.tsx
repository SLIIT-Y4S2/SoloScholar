// import React, { useState } from 'react';
// import {
//   AppstoreOutlined,
//   CalendarOutlined,
//   LinkOutlined,
//   MailOutlined,
//   SettingOutlined,
// } from '@ant-design/icons';
// import { Divider, Menu, Switch } from 'antd';
// const items = [
//   {
//     key: '1',
//     // icon: <MailOutlined />,
//     label: 'Introduction',
//   },
//   {
//     key: '2',
//     // icon: <CalendarOutlined />,
//     label: 'Learning outcomes',
//   },
//   {
//     key: '3',
//     label: 'Post Assestments',
//     // icon: <AppstoreOutlined />,
//   },
//   {
//     key: '4',
//     label: 'Sub topic 1',
//     // icon: <SettingOutlined />,
//   },
//   {
//     key: '5',
//     label: 'Sub topic 2',
//     // icon: <SettingOutlined />,
//   },
//   {
//     key: '6',
//     label: 'Post Assestment',
//     // icon: <SettingOutlined />,
//   },
  
// ];
// const LectureSidebar = () => {
//   const [mode, setMode] = useState('inline');
//   const [theme, setTheme] = useState('light');
//   const changeMode = (value) => {
//     setMode(value ? 'vertical' : 'inline');
//   };
//   const changeTheme = (value) => {
//     setTheme(value ? 'dark' : 'light');
//   };
//   return (
//     <>
      
      
      
//       <Menu
//         style={{
//           width: 256,
//         }}
//         defaultSelectedKeys={['1']}
//         defaultOpenKeys={['sub1']}
//         mode={mode}
//         theme={theme}
//         items={items}
//       />
//     </>
//   );
// };
// export default LectureSidebar;



import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import SublectureInfo from './SubLectureInfo';
import Assessment from './Assessment'; // Single component for all assessments

const { Content, Footer, Sider } = Layout;

interface Subtopic {
  id: number;
  name: string;
  completed: boolean;
}

const LectureSidebar: React.FC = () => {
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('1'); // Track the selected menu key

  // Simulate fetching data with dummy data
  useEffect(() => {
    const dummyData: Subtopic[] = [
      { id: 1, name: 'Introduction', completed: true },
      { id: 2, name: 'Learning Outcomes', completed: false },
      { id: 3, name: 'Post Assessment', completed: true },
      { id: 4, name: 'Sub Topic 1', completed: false },
      { id: 5, name: 'Sub Topic 2', completed: false },
      { id: 6, name: 'Final Assessment', completed: true },
    ];

    setTimeout(() => {
      setSubtopics(dummyData);
    }, 1000); // Simulate a delay of 1 second
  }, []);

  // Handle menu item click
  const handleMenuClick = (e: { key: string }): void => {
    setSelectedKey(e.key); // Update selectedKey with the clicked menu item's key
  };

  // Dynamically create menu items based on dummy subtopics
  const items = subtopics.map((subtopic, index) => ({
    key: `sub${index + 1}`,
    label: (
      <span>
        {subtopic.name}
        {subtopic.completed && (
          <CheckOutlined style={{ color: 'blue', marginLeft: 8 }} /> // Blue tick mark for completed subtopics
        )}
      </span>
    ),
  }));

  // Conditionally render components based on the selected menu key
  const renderContent = (): JSX.Element => {
    if (selectedKey === 'sub3' || selectedKey === 'sub6') {
      return <Assessment type={selectedKey === 'sub3' ? 'Post' : 'Final'} />; 
      // Pass type prop to differentiate between Post and Final Assessment
    } else {
      return <SublectureInfo />;
    }
  };

  return (
    <Layout>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <Layout
          style={{
            padding: '24px 0',
            background: '#fff',
          }}
        >
          <Sider
            style={{
              background: '#fff',
            }}
            width={200}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{
                height: '100%',
              }}
              items={items} // Render dynamic items here
              onClick={handleMenuClick} // Handle menu clicks
            />
          </Sider>
          <Content
            style={{
              padding: '0 24px',
              minHeight: 550,
            }}
          >
            {renderContent()} {/* Render the appropriate content */}
          </Content>
        </Layout>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default LectureSidebar;



