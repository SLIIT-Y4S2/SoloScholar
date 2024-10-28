import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, Typography, message, Modal, Form, Input, Button } from 'antd';
import { useWebSocket } from '../../../../provider/WebSocketContext';
import { useDiscussionForum } from '../../../../provider/DiscussionForumContext';
import DiscussionList from '../../../../Components/discussionForum/DiscussionList';
import CustomBreadcrumb from '../../../../Components/CustomBreadcrumb';
import { DiscussionType } from '../../../../types/discussionForum.types';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

export default function DiscussionForum() {
    const { module } = useParams();
    const [discussions, setDiscussions] = useState<DiscussionType[]>([]);
    const [isNewDiscussionModalVisible, setIsNewDiscussionModalVisible] = useState(false);

    const { socket } = useWebSocket();
    const { fetchDiscussions, createDiscussion } = useDiscussionForum();

    const [form] = Form.useForm();

    const navigate = useNavigate();

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
            socket.on('discussion_updated', (updatedDiscussion: DiscussionType) => {
                console.log('Discussion updated:', updatedDiscussion);
                setDiscussions(prevDiscussions =>
                    prevDiscussions.map(d => d.id === updatedDiscussion.id ? updatedDiscussion : d)
                );
            });

            return () => {
                socket.off('discussion_updated');
            };
        }
    }, [socket]);

    const handleSelectDiscussion = async (discussionId: string) => {
        // Goto the discussion page
        navigate(`./${discussionId}`);
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
        <Layout className="flex flex-col gap-8 my-6 mx-4 h-max">
            <div className='container mx-auto'>
                <CustomBreadcrumb />
            </div>
            <Layout className="container mx-auto">
                <Content>
                    <div className="flex flex-row justify-between items-center mb-4">
                        <Title level={2}>Discussions</Title>
                        <Button type="primary" onClick={() => setIsNewDiscussionModalVisible(true)}>
                            New Discussion
                        </Button>
                    </div>
                    <div className="flex">
                        <div className="w-full pr-4">
                            <DiscussionList
                                discussions={discussions}
                                onSelectDiscussion={handleSelectDiscussion}
                            />
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
        </Layout>
    );
}