import { Typography, Button, Space, Avatar } from 'antd';
import { LikeOutlined, LikeFilled, MoreOutlined, CommentOutlined } from '@ant-design/icons';
import { useAuth } from '../../provider/authProvider';

const { Title, Paragraph, Text } = Typography;

interface DiscussionDetailProps {
    title: string;
    content: string;
    likeCount: number;
    isLiked: boolean;
    onLike: () => void;
    onUnlike: () => void;
    user: string;
    time: string;
    creatorId: string;
    handleCommentTextArea: () => void;
}

export default function DiscussionDetail({
    title,
    content,
    likeCount,
    isLiked,
    onLike,
    onUnlike,
    user,
    time,
    creatorId,
    handleCommentTextArea
}: Readonly<DiscussionDetailProps>) {

    const { userDetails } = useAuth();

    console.log(userDetails?.id, creatorId);
    return (
        <div className="p-4 bg-white rounded-md">
            <div className="flex items-center justify-between mb-2">
                <Space>
                    <Avatar>{user[0]}</Avatar>
                    <Text strong>{user}</Text>
                    <Text type="secondary" className="text-sm"> | {time} ago</Text>
                </Space>
                {userDetails?.id === creatorId && < Button type="text" icon={<MoreOutlined />} />}
            </div>
            <Title level={2}>{title}</Title>
            <Paragraph>{content}</Paragraph>
            <div className="flex items-center">
                <Button
                    icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
                    onClick={isLiked ? onUnlike : onLike}
                >
                    {likeCount}
                </Button>
                <Button type="text" onClick={handleCommentTextArea}><CommentOutlined /></Button>
            </div>
        </div>
    );
}