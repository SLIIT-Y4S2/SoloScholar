import express from 'express';

import {
    createDiscussionHandler,
    getDiscussionByIdHandler,
    updateDiscussionHandler,
    deleteDiscussionHandler,
    addCommentToDiscussionHandler,
    likeDiscussionHandler,
    unlikeDiscussionHandler,
    likeCommentHandler,
    unlikeCommentHandler,
    getDiscussionsByModuleNameHandler
} from '../controllers/discussion.controller';

const router = express.Router();

router.post('/', createDiscussionHandler);
router.get('/:discussionId', getDiscussionByIdHandler);
router.get('/modules/:moduleName', getDiscussionsByModuleNameHandler);
router.put('/:discussionId', updateDiscussionHandler);
router.delete('/:discussionId', deleteDiscussionHandler);
router.post('/comments/:discussionId', addCommentToDiscussionHandler);
router.post('/like/:discussionId', likeDiscussionHandler);
router.delete('/:discussionId/like', unlikeDiscussionHandler);
router.post('/comments/:commentId/like', likeCommentHandler);
router.delete('/comments/:commentId/like', unlikeCommentHandler);

export default router;