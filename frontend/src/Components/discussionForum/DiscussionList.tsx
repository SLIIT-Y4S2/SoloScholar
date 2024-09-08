import { List, Avatar } from 'antd';
import { LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';

interface Discussion {
    id: string;
    title: string;
    creatorName: string;
    likeCount: number;
    commentCount: number;
}

interface DiscussionListProps {
    discussions: Discussion[];
    onSelectDiscussion: (id: string) => void;
}

export default function DiscussionList({ discussions, onSelectDiscussion }: Readonly<DiscussionListProps>) {
    return (
        <Content>
            <List
                className=''
                itemLayout="vertical"
                dataSource={discussions}
                renderItem={(item) => (

                    <List.Item
                        key={item.id}
                        onClick={() => onSelectDiscussion(item.id)}
                        className="cursor-pointer bg-white hover:bg-gray-100"
                        actions={[
                            <span className="px-3" key="likes"><LikeOutlined /> {item.likeCount}</span>,
                            <span className="px-3" key="comments"><MessageOutlined /> {item.commentCount}</span>,
                        ]}
                    >
                        <List.Item.Meta
                            className='px-3'
                            avatar={<Avatar>{item.creatorName[0]}</Avatar>}
                            title={item.title}
                            description={item.creatorName}
                        />
                    </List.Item>

                )}
            />
        </Content>
    );
}
