import { Form, Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

interface NewCommentProps {
    onSubmit: (content: string) => void;
}

export default function NewComment({ onSubmit }: Readonly<NewCommentProps>) {
    const [form] = Form.useForm();

    const handleSubmit = (values: { content: string }) => {
        onSubmit(values.content);
        form.resetFields();
    };

    return (
        <Form form={form} onFinish={handleSubmit} className="p-4 bg-white rounded-md">
            <Form.Item name="content" rules={[{ required: true, message: 'Please input your comment!' }]}>
                <Input.TextArea rows={2} placeholder="Add a comment..." />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                    Send
                </Button>
            </Form.Item>
        </Form>
    );
}
