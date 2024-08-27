import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { List, Card, Input, Button, Space, Divider, Typography, message, Modal, Form } from 'antd';
import { LikeOutlined, DislikeOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../../../../provider/authProvider';
import { useDiscussionForum } from '../../../../provider/DiscussionForumContext';

const { TextArea } = Input;
const { Title, Text } = Typography;

const DiscussionForum: React.FC = () => {
    const { module, lesson } = useParams();
    const { userDetails } = useAuth();
    const {
        topics,
        selectedTopic,
        posts,
        fetchTopics,
        handleTopicSelect,
        createPost,
        voteOnPost,
        createTopic,
    } = useDiscussionForum();
    const [newPostContent, setNewPostContent] = useState('');
    const [isNewTopicModalVisible, setIsNewTopicModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchTopics();
    }, [fetchTopics]);

    const handleSubmitPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTopic || !userDetails) {
            message.error('Unable to create post. Please try again.');
            return;
        }
        try {
            await createPost(newPostContent, selectedTopic.id, userDetails.id);
            setNewPostContent('');
            message.success('Post created successfully');
        } catch (error) {
            message.error('Failed to create post');
        }
    };

    const handleVote = async (postId: string, value: number) => {
        if (!userDetails) {
            message.error('You must be logged in to vote');
            return;
        }
        try {
            await voteOnPost(postId, userDetails.id, value);
            message.success('Vote recorded successfully');
        } catch (error) {
            message.error('Failed to record vote');
        }
    };

    const showNewTopicModal = () => {
        setIsNewTopicModalVisible(true);
    };

    const handleNewTopicCancel = () => {
        setIsNewTopicModalVisible(false);
        form.resetFields();
    };

    const handleNewTopicSubmit = async (values: { title: string; description: string }) => {
        try {
            await createTopic(values.title, values.description, parseInt(lesson!));
            message.success('New topic created successfully');
            setIsNewTopicModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to create new topic');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Title level={2} className="mb-8">Discussion Forum: {module} - {lesson}</Title>
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 pr-4 mb-8 md:mb-0">
                    <Card
                        title="Topics"
                        extra={
                            <Button type="primary" icon={<PlusOutlined />} onClick={showNewTopicModal}>
                                New Topic
                            </Button>
                        }
                        className="h-full"
                    >
                        <List
                            dataSource={topics}
                            renderItem={(topic) => (
                                <List.Item
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleTopicSelect(topic)}
                                >
                                    {topic.title}
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
                <div className="w-full md:w-2/3">
                    {selectedTopic ? (
                        <Card title={selectedTopic.title}>
                            <List
                                dataSource={posts}
                                renderItem={(post) => (
                                    <List.Item>
                                        <div className="w-full">
                                            <Text>{post.content}</Text>
                                            <div className="mt-2">
                                                <Space>
                                                    <Button
                                                        icon={<LikeOutlined />}
                                                        onClick={() => handleVote(post.id, 1)}
                                                    >
                                                        {post.votes.filter(v => v.value > 0).length}
                                                    </Button>
                                                    <Button
                                                        icon={<DislikeOutlined />}
                                                        onClick={() => handleVote(post.id, -1)}
                                                    >
                                                        {post.votes.filter(v => v.value < 0).length}
                                                    </Button>
                                                </Space>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                            <Divider />
                            <form onSubmit={handleSubmitPost}>
                                <TextArea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    rows={4}
                                    className="mb-4"
                                    placeholder="Write your post here..."
                                />
                                <Button type="primary" htmlType="submit">
                                    Submit Post
                                </Button>
                            </form>
                        </Card>
                    ) : (
                        <Card>
                            <Text>Select a topic to view posts</Text>
                        </Card>
                    )}
                </div>
            </div>
            <Modal
                title="Create New Topic"
                visible={isNewTopicModalVisible}
                onCancel={handleNewTopicCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleNewTopicSubmit} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Topic Title"
                        rules={[{ required: true, message: 'Please input the topic title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Topic Description"
                        rules={[{ required: true, message: 'Please input the topic description!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create Topic
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DiscussionForum;