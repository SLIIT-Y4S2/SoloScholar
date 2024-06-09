import { Layout } from "antd";

const { Content } = Layout;

const SecondaryLayoutContent = (props: any) => {
  const { content } = props;
  return (
    <Content
      style={{
        padding: "69px 54px 69px 54px",
        margin: "35px 80px 68px 45px",
        minHeight: 280,
        background: "#ffff",
        borderRadius: "15px",
      }}
    >
      {content}
    </Content>
  );
};

export default SecondaryLayoutContent;
