import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, message, Modal, Form, Input, Button } from 'antd';
import { useWebSocket } from '../../../../provider/WebSocketContext';
import { useDiscussionForum } from '../../../../provider/DiscussionForumContext';
import DiscussionList from '../../../../Components/discussionForum/DiscussionList';
import DiscussionDetail from '../../../../Components/discussionForum/DiscussionDetail';
import CommentList from '../../../../Components/discussionForum/CommentList';
import NewComment from '../../../../Components/discussionForum/NewComment';
import { useAuth } from '../../../../provider/authProvider';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

interface Discussion {
    id: string;
    title: string;
    content: string;
    creatorName: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    comments: Comment[];
}

interface Comment {
    id: string;
    content: string;
    creatorName: string;
    likeCount: number;
    isLiked: boolean;
}

export default function DiscussionForum() {
    const { module } = useParams();
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
    const [isNewDiscussionModalVisible, setIsNewDiscussionModalVisible] = useState(false);

    const { socket } = useWebSocket();
    const { fetchDiscussions, fetchDiscussion, addComment, createDiscussion } = useDiscussionForum();
    const { userDetails } = useAuth();

    const [form] = Form.useForm();

    useEffect(() => {
        if (!module) {
            message.error('Invalid module ID');
            return;
        }

        // Replace hyphens with spaces
        const moduleName = module.replace(/-/g, ' ');

        fetchDiscussions(moduleName)
            .then(setDiscussions)
            .catch(() => message.error('Failed to fetch discussions'));
    }, [module, fetchDiscussions]);

    useEffect(() => {
        if (socket) {
            socket.on('discussion_updated', (updatedDiscussion: Discussion) => {
                setDiscussions(prevDiscussions =>
                    prevDiscussions.map(d => d.id === updatedDiscussion.id ? updatedDiscussion : d)
                );
                if (selectedDiscussion && selectedDiscussion.id === updatedDiscussion.id) {
                    setSelectedDiscussion(updatedDiscussion);
                }
            });

            return () => {
                socket.off('discussion_updated');
            };
        }
    }, [socket, selectedDiscussion]);

    const handleSelectDiscussion = async (discussionId: string) => {
        try {
            const discussion = await fetchDiscussion(discussionId);
            setSelectedDiscussion(discussion);
            if (socket) {
                socket.emit('join_discussion', discussionId);
            }
        } catch (error) {
            message.error('Failed to fetch discussion details');
        }
    };

    const handleLikeDiscussion = () => {
        if (socket && selectedDiscussion) {
            socket.emit('like_discussion', { discussionId: selectedDiscussion.id, userId: userDetails?.id });
        }
    };

    const handleUnlikeDiscussion = () => {
        if (socket && selectedDiscussion) {
            socket.emit('unlike_discussion', { discussionId: selectedDiscussion.id, userId: userDetails?.id });
        }
    };

    const handleLikeComment = (commentId: string) => {
        if (socket && selectedDiscussion) {

            console.log('like ----- comment', commentId);
            socket.emit('like_comment', { discussionId: selectedDiscussion.id, commentId, userId: userDetails?.id });
        }
    };

    const handleUnlikeComment = (commentId: string) => {
        if (socket && selectedDiscussion) {
            socket.emit('unlike_comment', { discussionId: selectedDiscussion.id, commentId, userId: userDetails?.id });
        }
    };

    const handleAddComment = async (content: string) => {
        if (selectedDiscussion) {
            try {
                await addComment(selectedDiscussion.id, content);
            } catch (error) {
                message.error('Failed to add comment');
            }
        }
    };

    const handleCreateDiscussion = async (values: { title: string; content: string }) => {
        if (!module) {
            message.error('Invalid module ID');
            return;
        }

        const moduleName = module.replace(/-/g, ' ');

        try {
            const newDiscussion = await createDiscussion(moduleName, values.title, values.content);
            setDiscussions(prevDiscussions => [newDiscussion, ...prevDiscussions]);
            setIsNewDiscussionModalVisible(false);
            form.resetFields();
            message.success('Discussion created successfully');
        } catch (error) {
            message.error('Failed to create discussion');
        }
    };

    return (
        <Layout className="min-h-screen">
            <Content className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <Title level={2}>Discussions</Title>
                    <Button type="primary" onClick={() => setIsNewDiscussionModalVisible(true)}>
                        New Discussion
                    </Button>
                </div>
                <div className="flex">
                    <div className="w-1/3 pr-4">
                        <DiscussionList
                            discussions={discussions}
                            onSelectDiscussion={handleSelectDiscussion}
                        />
                    </div>
                    <div className="w-2/3 bg-white">
                        {selectedDiscussion ? (
                            <>
                                <DiscussionDetail
                                    title={selectedDiscussion.title}
                                    content={selectedDiscussion.content}
                                    likeCount={selectedDiscussion.likeCount}
                                    isLiked={selectedDiscussion.isLiked}
                                    onLike={handleLikeDiscussion}
                                    onUnlike={handleUnlikeDiscussion}
                                />
                                <NewComment onSubmit={handleAddComment} />
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
            <Modal
                title="Create New Discussion"
                open={isNewDiscussionModalVisible}
                onCancel={() => setIsNewDiscussionModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleCreateDiscussion} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input the discussion title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Content"
                        rules={[{ required: true, message: 'Please input the discussion content!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create Discussion
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}