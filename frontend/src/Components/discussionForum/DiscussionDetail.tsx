import { Typography, Button } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface DiscussionDetailProps {
    title: string;
    content: string;
    likeCount: number;
    isLiked: boolean;
    onLike: () => void;
    onUnlike: () => void;
}

export default function DiscussionDetail({
    title,
    content,
    likeCount,
    isLiked,
    onLike,
    onUnlike,
}: Readonly<DiscussionDetailProps>) {
    return (
        <div className="p-4 border-b">
            <Title level={2}>{title}</Title>
            <Paragraph>{content}</Paragraph>
            <div className="flex items-center">
                <Button
                    icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
                    onClick={isLiked ? onUnlike : onLike}
                >
                    {likeCount}
                </Button>
            </div>
        </div>
    );
}