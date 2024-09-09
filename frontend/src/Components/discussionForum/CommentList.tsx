import { List, Tooltip, Avatar } from 'antd';
import { Comment } from '@ant-design/compatible';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { CommentType } from '../../types/discussionForum.types';

interface CommentListProps {
    comments: CommentType[];
    onLikeComment: (commentId: number) => void;
    onUnlikeComment: (commentId: number) => void;
}

export default function CommentList({ comments, onLikeComment, onUnlikeComment }: Readonly<CommentListProps>) {
    return (
        <List
            itemLayout="horizontal"
            dataSource={comments}
            locale={{ emptyText: 'No comments yet.' }}
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
                                    <span className="pl-2">{item.likeCount}</span>
                                </span>
                            </Tooltip>
                        ]}
                    />
                </Content>
            )}
        />
        // <Content>
        //     {comments && comments.length === 0 && <p className='text-gray-500 text-center'>No comments yet.</p>}{
        //         comments && comments.length > 0 &&
        //         comments.map((comment) => (
        //             <Comment
        //                 key={comment.id}
        //                 className='flex items-start space-x-3 mb-3 px-3 rounded-md'
        //                 author={comment.creatorName}
        //                 avatar={<Avatar>{comment.creatorName[0]}</Avatar>}
        //                 content={comment.content}
        //                 actions={[
        //                     <Tooltip key="comment-like" title={comment.isLiked ? "Unlike" : "Like"}>
        //                         <span onClick={() => comment.isLiked ? onUnlikeComment(comment.id) : onLikeComment(comment.id)}>
        //                             {comment.isLiked ? <LikeFilled /> : <LikeOutlined />}
        //                             <span className="pl-2">{comment.likeCount}</span>
        //                         </span>
        //                     </Tooltip>
        //                 ]}
        //             />
        //         ))
        //     }
        // </Content >
    );
}
