import { Avatar, Button, Tooltip } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { useDiscussionForum } from '../../provider/DiscussionForumContext';
import { useWebSocket } from '../../provider/WebSocketContext';
import { Comment } from '../../types/discussionForum.types';
interface CommentItemProps {
    discussionId: string;
    comment: Comment;
}

export default function CommentItem({ comment, discussionId }: Readonly<CommentItemProps>) {
    const { likeComment } = useDiscussionForum();
    const { socket } = useWebSocket();

    const handleLikeComment = async () => {
        await likeComment(discussionId, comment.id);
        if (socket) {
            socket.emit('like_comment', { discussionId: discussionId, commentId: comment.id });
        }
    };

    return (
        <div className="flex items-start space-x-3 mb-3">
            <Avatar />
            <div className="flex-grow">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold">{"comment.creator.name"}</span>
                    <span className="text-gray-500 text-sm">{comment.createdAt}</span>
                </div>
                <p>{comment.content}</p>
                <Tooltip title={comment.liked ? 'Unlike' : 'Like'}>
                    <Button
                        icon={comment.liked ? <LikeFilled /> : <LikeOutlined />}
                        onClick={handleLikeComment}
                        type="text"
                        size="small"
                    >
                        {comment.likes}
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
}