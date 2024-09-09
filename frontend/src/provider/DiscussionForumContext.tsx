import { createContext, ReactNode, useContext, useMemo } from 'react';
import { fetchDiscussions, addComment, createDiscussion, fetchDiscussion, likeComment, likeDiscussion, unlikeComment, unlikeDiscussion } from '../services/discussionForum.service';

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

interface DiscussionForumContextType {
    fetchDiscussions: (moduleId: string) => Promise<Discussion[]>;
    fetchDiscussion: (discussionId: string) => Promise<Discussion>;
    createDiscussion: (moduleName: string, title: string, content: string) => Promise<Discussion>;
    addComment: (discussionId: string, content: string) => Promise<Comment>;
    likeDiscussion: (discussionId: string) => Promise<void>;
    unlikeDiscussion: (discussionId: string) => Promise<void>;
    likeComment: (discussionId: string, commentId: number) => Promise<void>;
    unlikeComment: (discussionId: string, commentId: string) => Promise<void>;
}

interface DiscussionForumProps {
    readonly children: ReactNode;
}

const DiscussionForumContext = createContext<DiscussionForumContextType>({} as DiscussionForumContextType);

export const useDiscussionForum = () => useContext(DiscussionForumContext);

export function DiscussionForumProvider({ children }: DiscussionForumProps) {
    const contextValue: DiscussionForumContextType = useMemo(() => ({
        fetchDiscussions: fetchDiscussions,
        fetchDiscussion: fetchDiscussion,
        createDiscussion: createDiscussion,
        addComment: addComment,
        likeDiscussion: likeDiscussion,
        unlikeDiscussion: unlikeDiscussion,
        likeComment: likeComment,
        unlikeComment: unlikeComment,
    }), []);

    return (
        <DiscussionForumContext.Provider value={contextValue}>
            {children}
        </DiscussionForumContext.Provider>
    );
}