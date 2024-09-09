import { useEffect, useState } from "react";
import CommentList from "../../../../Components/discussionForum/CommentList";
import DiscussionDetail from "../../../../Components/discussionForum/DiscussionDetail";
import NewComment from "../../../../Components/discussionForum/NewComment";
import { DiscussionType } from "../../../../types/discussionForum.types";
import { useDiscussionForum } from "../../../../provider/DiscussionForumContext";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../../../../provider/WebSocketContext";
import { useAuth } from "../../../../provider/authProvider";
import { Layout, message } from "antd";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import { Content } from "antd/es/layout/layout";
import { timeAgo } from "../../../../utils/discussionForum.utils";

export default function Discussion() {
    const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionType | null>(null);
    const [isCommentTextAreaVisible, setIsCommentTextAreaVisible] = useState(false);
    const { fetchDiscussion } = useDiscussionForum();

    const { discussionId } = useParams();
    const { userDetails } = useAuth();
    const { socket } = useWebSocket();

    useEffect(() => {
        if (!discussionId) {
            return;
        }

        fetchDiscussion(discussionId)
            .then(setSelectedDiscussion)
            .catch(() => {
                message.error("Failed to fetch discussion");
                setSelectedDiscussion(null);
            });
    }, [discussionId, fetchDiscussion]);

    useEffect(() => {
        if (socket && discussionId) {
            socket.emit('join_discussion', discussionId);

            socket.on('discussion_updated', () => {
                fetchDiscussion(discussionId).then((discussion) => {
                    setSelectedDiscussion(discussion);
                }).catch(() => console.error('Failed to fetch discussion'));

            });

            socket.on('error', (error: { message: string }) => {
                message.error(error.message);
            });

            return () => {
                socket.emit('leave_discussion', discussionId);
                socket.off('discussion_updated');
                socket.off('error');
            };
        }
    }, [socket, discussionId]);

    const handleLikeDiscussion = () => {
        if (socket && selectedDiscussion && userDetails) {
            if (selectedDiscussion.isLiked) {
                message.info("You've already liked this discussion.");
                return;
            }
            socket.emit('like_discussion', { discussionId: selectedDiscussion.id, userId: userDetails.id });
        }
    };

    const handleUnlikeDiscussion = () => {
        if (socket && selectedDiscussion && userDetails) {
            if (!selectedDiscussion.isLiked) {
                message.info("You haven't liked this discussion yet.");
                return;
            }
            socket.emit('unlike_discussion', { discussionId: selectedDiscussion.id, userId: userDetails.id });
        }
    };

    const handleLikeComment = (commentId: number) => {
        if (socket && selectedDiscussion && userDetails) {
            const comment = selectedDiscussion.comments.find(c => c.id === commentId);
            if (comment && comment.isLiked) {
                message.info("You've already liked this comment.");
                return;
            }
            socket.emit('like_comment', { discussionId: selectedDiscussion.id, commentId, userId: userDetails.id });
        }
    };

    const handleUnlikeComment = (commentId: number) => {
        if (socket && selectedDiscussion && userDetails) {
            const comment = selectedDiscussion.comments.find(c => c.id === commentId);
            if (comment && !comment.isLiked) {
                message.info("You haven't liked this comment yet.");
                return;
            }
            socket.emit('unlike_comment', { discussionId: selectedDiscussion.id, commentId, userId: userDetails.id });
        }
    };

    const handleAddComment = async (content: string) => {
        if (socket && selectedDiscussion && userDetails) {
            socket.emit('add_comment', { discussionId: selectedDiscussion.id, content, userId: userDetails.id });
        }
    };

    const handleCommentTextArea = () => {
        setIsCommentTextAreaVisible(isVisible => !isVisible);
    }

    return (
        <Layout className="flex flex-col gap-8 my-6 mx-4 h-max">
            <CustomBreadcrumb />
            <Layout className="min-h-screen">
                <Content className="p-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="w-full flex flex-col gap-4">
                            {selectedDiscussion ? (
                                <>
                                    <DiscussionDetail
                                        title={selectedDiscussion.title}
                                        content={selectedDiscussion.content}
                                        likeCount={selectedDiscussion.likeCount}
                                        isLiked={selectedDiscussion.isLiked}
                                        onLike={handleLikeDiscussion}
                                        onUnlike={handleUnlikeDiscussion}
                                        user={selectedDiscussion.creatorName}
                                        time={timeAgo(selectedDiscussion.created_at)}
                                        creatorId={selectedDiscussion.creator_id}
                                        handleCommentTextArea={handleCommentTextArea}
                                    />
                                    {isCommentTextAreaVisible && <NewComment onSubmit={handleAddComment} />}
                                    <CommentList
                                        comments={selectedDiscussion.comments}
                                        onLikeComment={handleLikeComment}
                                        onUnlikeComment={handleUnlikeComment}
                                    />
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p>Select a discussion to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}