import { useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import { useDiscussionForum } from '../../provider/DiscussionForumContext';
import { useWebSocket } from '../../provider/WebSocketContext';
const { TextArea } = Input;

interface NewDiscussionFormProps {
    moduleName: string;
}

const NewDiscussionForm: React.FC<NewDiscussionFormProps> = ({ moduleName }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { createDiscussion } = useDiscussionForum();
    const { socket } = useWebSocket();

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            message.error('Please enter both title and content for the discussion.');
            return;
        }

        try {
            await createDiscussion(moduleName, title, content);
            setTitle('');
            setContent('');
            message.success('Discussion created successfully!');

            if (socket) {
                socket.emit('new discussion', { moduleName });
            }
        } catch (error) {
            message.error('Failed to create discussion. Please try again.');
        }
    };

    return (
        <Card title="Create New Discussion" className="mb-6">
            <Input
                placeholder="Discussion Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-3"
            />
            <TextArea
                placeholder="What would you like to discuss?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoSize={{ minRows: 3, maxRows: 6 }}
                className="mb-3"
            />
            <div className="flex justify-end">
                <Button type="primary" onClick={handleSubmit}>
                    Create Discussion
                </Button>
            </div>
        </Card>
    );
};

export default NewDiscussionForm;