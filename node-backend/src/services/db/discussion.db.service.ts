import prisma from "../../utils/prisma-client.util";
import { omit } from "lodash";

interface DiscussionInput {
    title: string;
    content: string;
    moduleId: number;
    creatorId: string;
}

interface CommentInput {
    content: string;
    creatorId: string;
}

/**
 * Create a new discussion
 * @param discussionInput 
 * @returns 
 */
export async function createDiscussion(discussionInput: DiscussionInput) {
    const discussion = await prisma.discussion.create({
        data: {
            title: discussionInput.title,
            content: discussionInput.content,
            module: {
                connect: { id: discussionInput.moduleId }
            },
            creator: {
                connect: { id: discussionInput.creatorId }
            }
        },
        include: {
            creator: true,
            _count: { select: { comments: true, likes: true } },
        }
    });

    return {
        ...omit(discussion, ["creator"]),
        creatorName: `${discussion.creator.first_name} ${discussion.creator.last_name}`,
        commentCount: discussion._count.comments,
        likeCount: discussion._count.likes,
        isLiked: false,
    };
}

/**
 * Update an existing discussion
 * @param discussionId 
 * @param updateData 
 * @returns 
 */
export async function updateDiscussion(discussionId: string, updateData: Partial<DiscussionInput>) {
    const updatedDiscussion = await prisma.discussion.update({
        where: { id: discussionId },
        data: {
            title: updateData.title,
            content: updateData.content,
        },
        include: {
            creator: true,
            _count: { select: { comments: true, likes: true } },
        }
    });

    return {
        ...omit(updatedDiscussion, ["creator"]),
        creatorName: `${updatedDiscussion.creator.first_name} ${updatedDiscussion.creator.last_name}`,
        commentCount: updatedDiscussion._count.comments,
        likeCount: updatedDiscussion._count.likes,
    };
}

/**
 * Delete a discussion
 * @param discussionId 
 */
export async function deleteDiscussion(discussionId: string) {
    await prisma.$transaction([
        prisma.discussion_comment_like.deleteMany({
            where: { comment: { discussion_id: discussionId } }
        }),
        prisma.discussion_comment.deleteMany({
            where: { discussion_id: discussionId }
        }),
        prisma.discussion_like.deleteMany({
            where: { discussion_id: discussionId }
        }),
        prisma.discussion.delete({
            where: { id: discussionId }
        })
    ]);
}

/**
 * Add a comment to a discussion
 * @param discussionId 
 * @param commentInput 
 * @returns 
 */
export async function addCommentToDiscussion(discussionId: string, commentInput: CommentInput) {
    const comment = await prisma.discussion_comment.create({
        data: {
            content: commentInput.content,
            discussion: {
                connect: { id: discussionId }
            },
            creator: {
                connect: { id: commentInput.creatorId }
            }
        },
        include: {
            creator: true,
            _count: { select: { likes: true } },
        }
    });

    return {
        ...omit(comment, ["creator"]),
        creatorName: `${comment.creator.first_name} ${comment.creator.last_name}`,
        likeCount: comment._count.likes,
        isLiked: false,
    };
}

/**
 * Like a discussion
 * @param discussionId 
 * @param personId 
 * @returns 
 */
export async function likeDiscussion(discussionId: string, personId: string) {
    const like = await prisma.discussion_like.create({
        data: {
            discussion: { connect: { id: discussionId } },
            person: { connect: { id: personId } },
        },
    });
    return like;
}

/**
 * Unlike a discussion
 * @param discussionId 
 * @param personId 
 */
export async function unlikeDiscussion(discussionId: string, personId: string) {
    await prisma.discussion_like.delete({
        where: {
            discussion_id_person_id: {
                discussion_id: discussionId,
                person_id: personId,
            },
        },
    });
}

/**
 * Like a comment
 * @param commentId 
 * @param personId 
 * @returns 
 */
export async function likeComment(commentId: number, personId: string) {
    const like = await prisma.discussion_comment_like.create({
        data: {
            comment: { connect: { id: commentId } },
            person: { connect: { id: personId } },
        },
    });
    return like;
}

/**
 * Unlike a comment
 * @param commentId 
 * @param personId 
 */
export async function unlikeComment(commentId: number, personId: string) {
    await prisma.discussion_comment_like.delete({
        where: {
            comment_id_person_id: {
                comment_id: commentId,
                person_id: personId,
            },
        },
    });
}

/**
 * Get a discussion by ID
 * @param discussionId 
 * @param currentUserId 
 * @returns 
 */
export async function getDiscussionById(discussionId: string, currentUserId: string) {
    const discussion = await prisma.discussion.findUnique({
        where: { id: discussionId },
        include: {
            comments: {
                include: {
                    creator: true,
                    likes: true,
                    _count: { select: { likes: true } },
                }
            },
            creator: true,
            likes: true,
            _count: { select: { likes: true } },
        }
    });

    if (!discussion) throw new Error("Discussion not found");

    return {
        ...omit(discussion, ["creator"]),
        likeCount: discussion._count.likes,
        isLiked: discussion.likes.some(like => like.person_id === currentUserId),
        creatorName: `${discussion.creator.first_name} ${discussion.creator.last_name}`,
        comments: discussion.comments.map(comment => ({
            ...omit(comment, ["creator"]),
            likeCount: comment._count.likes,
            isLiked: comment.likes.some(like => like.person_id === currentUserId),
            creatorName: `${comment.creator.first_name} ${comment.creator.last_name}`
        })),
    };
}

/**
 * Get discussions by module ID
 * @param moduleId 
 * @param currentUserId 
 * @returns 
 */
export async function getDiscussionsByModuleId(moduleId: number, currentUserId: string) {
    const discussions = await prisma.discussion.findMany({
        where: { module_id: moduleId },
        include: {
            creator: true,
            likes: true,
            _count: { select: { comments: true, likes: true } },
        },
        orderBy: { created_at: 'desc' },
    });

    return discussions.map(discussion => ({
        ...omit(discussion, ["creator", "likes"]),
        creatorName: `${discussion.creator.first_name} ${discussion.creator.last_name}`,
        commentCount: discussion._count.comments,
        likeCount: discussion._count.likes,
        isLiked: discussion.likes.some(like => like.person_id === currentUserId),
    }));
}