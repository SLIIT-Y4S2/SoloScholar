import { Card } from "antd";

interface CardProps {
  title: string;
  content: any;
  twClassNames?: string;
}

const IndicatorCard = (props: CardProps) => {
  const { title, content, twClassNames } = props;
  return (
    <Card className={twClassNames ?? ""} title={title}>
      {content}
    </Card>
  );
};

export default IndicatorCard;
