import { Avatar, Card, Space, Typography, Button } from 'antd';
import { DislikeOutlined, LikeOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';
import { DiscussionType } from '../../types/discussionForum.types';
import { timeAgo } from '../../utils/discussionForum.utils';

const { Text } = Typography;


interface DiscussionListProps {
    discussions: DiscussionType[];
    onSelectDiscussion: (id: string) => void;
}

export default function DiscussionList({ discussions, onSelectDiscussion }: Readonly<DiscussionListProps>) {
    return (
        <Content>
            {discussions.map((discussion) => (
                <Discussion
                    key={discussion.id}
                    user={discussion.creatorName}
                    time={timeAgo(discussion.created_at)}
                    title={discussion.title}
                    content={discussion.content}
                    likes={discussion.likeCount}
                    comments={discussion._count.comments}
                    onSelectDiscussion={() => onSelectDiscussion(discussion.id)}
                />))}
        </Content>
    );
}

interface DiscussionProps {
    user: string;
    time: string;
    title: string;
    content: string;
    likes: number;
    comments: number;
    onSelectDiscussion: () => void;
}
function Discussion({ user, time, title, content, likes, comments, onSelectDiscussion }: Readonly<DiscussionProps>) {
    return (
        <Card className="mb-4 cursor-pointer hover:bg-zinc-100" onClick={onSelectDiscussion}>
            <div className="flex items-center justify-between mb-2">
                <Space>
                    <Avatar>{user[0]}</Avatar>
                    <Text strong>{user}</Text>
                    <Text type="secondary" className="text-sm"> | {time} ago</Text>
                </Space>
            </div>
            <Typography.Title level={4} className="mb-2">{title}</Typography.Title>
            <Typography.Paragraph className="text-gray-700 mb-4" ellipsis={{ rows: 4 }}>{content}</Typography.Paragraph>
            <Space className="text-gray-500">
                <span className="flex items-center gap-2 text-black">
                    <LikeOutlined />{likes}
                </span>
                <Button type="text" icon={<DislikeOutlined />}></Button>
                <Button type="text" icon={<MessageOutlined />}>{comments}</Button>
                <Button type="text" icon={<ShareAltOutlined />} />
            </Space>
        </Card>
    )
}