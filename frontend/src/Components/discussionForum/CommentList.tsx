import { List, Tooltip, Avatar } from 'antd';
import { Comment } from '@ant-design/compatible';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';

interface CommentItem {
    id: string;
    content: string;
    creatorName: string;
    likeCount: number;
    isLiked: boolean;
}

interface CommentListProps {
    comments: CommentItem[];
    onLikeComment: (commentId: string) => void;
    onUnlikeComment: (commentId: string) => void;
}

export default function CommentList({ comments, onLikeComment, onUnlikeComment }: Readonly<CommentListProps>) {
    return (
        <List
            className="p-4"
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item) => (
                <Content>
                    <Comment
                        className='flex items-start space-x-3 mb-3 px-3 rounded-md'
                        author={item.creatorName}
                        avatar={<Avatar>{item.creatorName[0]}</Avatar>}
                        content={item.content}
                        actions={[
                            <Tooltip key="comment-like" title={item.isLiked ? "Unlike" : "Like"}>
                                <span onClick={() => item.isLiked ? onUnlikeComment(item.id) : onLikeComment(item.id)}>
                                    {item.isLiked ? <LikeFilled /> : <LikeOutlined />}
                                    <span className="comment-action">{item.likeCount}</span>
                                </span>
                            </Tooltip>
                        ]}
                    />
                </Content>
            )}
        />
    );
}
