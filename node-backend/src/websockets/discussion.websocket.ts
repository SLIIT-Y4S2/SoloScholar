import { Server, Socket } from 'socket.io';
import {
    addCommentToDiscussion,
    getDiscussionById,
    likeDiscussion,
    unlikeDiscussion,
    likeComment,
    unlikeComment
} from '../services/db/discussion.db.service';

export function setupDiscussionWebSocket(io: Server) {

    io.on('connection', (socket: Socket) => {
        console.log('A user connected to discussion WebSocket');

        socket.on('join_discussion', (discussionId: string) => {
            socket.join(discussionId);
            console.log(`User joined discussion: ${discussionId}`);
        });

        socket.on('leave_discussion', (discussionId: string) => {
            socket.leave(discussionId);
            console.log(`User left discussion: ${discussionId}`);
        });

        socket.on('add_comment', async (data: { discussionId: string, content: string }) => {
            try {
                const { discussionId, content } = data;
                const creatorId = socket.data.user.id;  // Assuming user data is attached to socket

                const newComment = await addCommentToDiscussion(discussionId, { content, creatorId });

                // Fetch updated discussion to get latest state
                const updatedDiscussion = await getDiscussionById(discussionId, creatorId);

                io.to(discussionId).emit('discussion_updated', updatedDiscussion);
                socket.emit('comment added', newComment);
            } catch (error) {
                console.error('Error adding comment:', error);
                socket.emit('error', { message: 'Failed to add comment' });
            }
        });

        socket.on('like_discussion', async (data: { discussionId: string, userId: string }) => {
            try {
                const { discussionId, userId } = data;
                await likeDiscussion(discussionId, userId);
                const updatedDiscussion = await getDiscussionById(discussionId, userId);
                io.to(discussionId).emit('discussion_updated', updatedDiscussion);
            } catch (error) {
                console.error('Error liking discussion:', error);
                socket.emit('error', { message: 'Failed to like discussion' });
            }
        });

        socket.on('unlike_discussion', async (data: { discussionId: string, userId: string }) => {
            try {
                const { discussionId, userId } = data;
                await unlikeDiscussion(discussionId, userId);
                const updatedDiscussion = await getDiscussionById(discussionId, userId);
                io.to(discussionId).emit('discussion_updated', updatedDiscussion);
            } catch (error) {
                console.error('Error unliking discussion:', error);
                socket.emit('error', { message: 'Failed to unlike discussion' });
            }
        });

        socket.on('like_comment', async (data: { discussionId: string, commentId: number, userId: string }) => {
            try {
                const { discussionId, commentId, userId } = data;

                await likeComment(commentId, userId);
                const updatedDiscussion = await getDiscussionById(discussionId, userId);
                io.to(discussionId).emit('discussion_updated', updatedDiscussion);
            } catch (error) {
                console.error('Error liking comment:', error);
                socket.emit('error', { message: 'Failed to like comment' });
            }
        });

        socket.on('unlike_comment', async (data: { discussionId: string, commentId: number, userId: string }) => {
            try {
                const { discussionId, commentId, userId } = data;
                await unlikeComment(commentId, userId);
                const updatedDiscussion = await getDiscussionById(discussionId, userId);
                io.to(discussionId).emit('discussion_updated', updatedDiscussion);
            } catch (error) {
                console.error('Error unliking comment:', error);
                socket.emit('error', { message: 'Failed to unlike comment' });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected from discussion WebSocket');
        });
    });
}