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
        console.log(`A user connected to discussion WebSocket. ${socket.id}`);

        socket.on('join_discussion', (discussionId: string) => {
            socket.join(discussionId);
            console.log(`User joined discussion: ${discussionId}`);
        });

        socket.on('leave_discussion', (discussionId: string) => {
            socket.leave(discussionId);
            console.log(`User left discussion: ${discussionId}`);
        });

        socket.on('add_comment', async (data: { discussionId: string, content: string, userId: string }) => {
            try {
                const { discussionId, content, userId } = data;
                const newComment = await addCommentToDiscussion(discussionId, { content: content, creatorId: userId });

                io.to(discussionId).emit('discussion_updated');
                socket.emit('comment_added', newComment);
            } catch (error) {
                console.error('Error adding comment:', error);
                socket.emit('error', { message: 'Failed to add comment' });
            }
        });

        socket.on('like_discussion', async (data: { discussionId: string, userId: string }) => {
            try {
                const { discussionId, userId } = data;
                const result = await likeDiscussion(discussionId, userId);

                if (result === null) {
                    socket.emit('info', { message: "You've already liked this discussion." });
                } else {
                    io.to(discussionId).emit('discussion_updated');
                }
            } catch (error) {
                console.error('Error liking discussion:', error);
                socket.emit('error', { message: 'Failed to like discussion' });
            }
        });

        socket.on('unlike_discussion', async (data: { discussionId: string, userId: string }) => {
            try {
                const { discussionId, userId } = data;
                const result = await unlikeDiscussion(discussionId, userId);

                if (result === null) {
                    socket.emit('info', { message: "You haven't liked this discussion yet." });
                } else {
                    io.to(discussionId).emit('discussion_updated');
                }
            } catch (error) {
                console.error('Error unliking discussion:', error);
                socket.emit('error', { message: 'Failed to unlike discussion' });
            }
        });

        socket.on('like_comment', async (data: { discussionId: string, commentId: number, userId: string }) => {
            try {
                const { discussionId, commentId, userId } = data;
                const result = await likeComment(commentId, userId);

                if (result === null) {
                    socket.emit('info', { message: "You've already liked this comment." });
                } else {
                    io.to(discussionId).emit('discussion_updated');
                }
            } catch (error) {
                console.error('Error liking comment:', error);
                socket.emit('error', { message: 'Failed to like comment' });
            }
        });

        socket.on('unlike_comment', async (data: { discussionId: string, commentId: number, userId: string }) => {
            try {
                const { discussionId, commentId, userId } = data;
                const result = await unlikeComment(commentId, userId);

                if (result === null) {
                    socket.emit('info', { message: "You haven't liked this comment yet." });
                } else {
                    io.to(discussionId).emit('discussion_updated');
                }
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