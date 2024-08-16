import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const Error = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <Result
      status="500"
      title={title}
      subTitle={subTitle}
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};

export default Error;
