import { createContext, ReactNode, useContext, useMemo } from 'react';
import { fetchDiscussions, addComment, createDiscussion, fetchDiscussion, likeComment, likeDiscussion, unlikeComment, unlikeDiscussion } from '../services/discussionForum.service';
import { DiscussionType } from '../types/discussionForum.types';

interface DiscussionForumContextType {
    fetchDiscussions: (moduleId: string) => Promise<DiscussionType[]>;
    fetchDiscussion: (discussionId: string) => Promise<DiscussionType>;
    createDiscussion: (moduleName: string, title: string, content: string) => Promise<DiscussionType>;
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