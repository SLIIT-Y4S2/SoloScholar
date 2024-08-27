import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import { message } from 'antd';

interface Topic {
    id: string;
    title: string;
    description?: string;
    lessonId: number;
}

interface Post {
    id: string;
    content: string;
    authorId: string;
    topicId: string;
    createdAt: string;
    updatedAt: string;
    votes: Vote[];
}

interface Vote {
    id: string;
    value: number;
    userId: string;
}

interface DiscussionForumContextType {
    topics: Topic[];
    selectedTopic: Topic | null;
    posts: Post[];
    fetchTopics: () => Promise<void>;
    fetchPosts: (topicId: string) => Promise<void>;
    handleTopicSelect: (topic: Topic) => void;
    createPost: (content: string, topicId: string, authorId: string) => Promise<Post>;
    voteOnPost: (postId: string, userId: string, value: number) => Promise<Vote>;
    createTopic: (title: string, description: string, lessonId: number) => Promise<Topic>;
}

const DiscussionForumContext = createContext<DiscussionForumContextType | undefined>(undefined);

export const useDiscussionForum = () => {
    const context = useContext(DiscussionForumContext);
    if (!context) {
        throw new Error('useDiscussionForum must be used within a DiscussionForumProvider');
    }
    return context;
};

interface DiscussionForumProviderProps {
    children: ReactNode;
}

export const DiscussionForumProvider: React.FC<DiscussionForumProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('post created', handleNewPost);
            socket.on('topic created', handleNewTopic);

            return () => {
                socket.off('post created', handleNewPost);
                socket.off('topic created', handleNewTopic);
            };
        }
    }, [socket]);

    const fetchTopics = async () => {
        try {
            const response = await fetch('/api/topics');
            const data = await response.json();
            setTopics(data);
        } catch (error) {
            message.error('Failed to fetch topics');
        }
    };

    const fetchPosts = async (topicId: string) => {
        try {
            const response = await fetch(`/api/topics/${topicId}/posts`);
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            message.error('Failed to fetch posts');
        }
    };

    const handleTopicSelect = (topic: Topic) => {
        setSelectedTopic(topic);
        fetchPosts(topic.id);
        if (socket) {
            socket.emit('join topic', topic.id);
        }
    };

    const handleNewPost = (post: Post) => {
        setPosts((prevPosts) => [...prevPosts, post]);
    };

    const handleNewTopic = (topic: Topic) => {
        setTopics((prevTopics) => [...prevTopics, topic]);
    };

    const createPost = async (content: string, topicId: string, authorId: string): Promise<Post> => {
        try {
            const newPost = { content, topicId, authorId };
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost),
            });
            const createdPost = await response.json();
            return createdPost;
        } catch (error) {
            message.error('Failed to create post');
            throw error;
        }
    };

    const voteOnPost = async (postId: string, userId: string, value: number): Promise<Vote> => {
        try {
            const response = await fetch('/api/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, userId, value }),
            });
            const vote = await response.json();
            await fetchPosts(selectedTopic!.id);
            return vote;
        } catch (error) {
            message.error('Failed to vote on post');
            throw error;
        }
    };

    const createTopic = async (title: string, description: string, lessonId: number): Promise<Topic> => {
        try {
            const newTopic = { title, description, lessonId };
            const response = await fetch('/api/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTopic),
            });
            const createdTopic = await response.json();
            setTopics((prevTopics) => [...prevTopics, createdTopic]);
            return createdTopic;
        } catch (error) {
            message.error('Failed to create topic');
            throw error;
        }
    };

    const value: DiscussionForumContextType = {
        topics,
        selectedTopic,
        posts,
        fetchTopics,
        fetchPosts,
        handleTopicSelect,
        createPost,
        voteOnPost,
        createTopic,
    };

    return (
        <DiscussionForumContext.Provider value={value}>
            {children}
        </DiscussionForumContext.Provider>
    );
};