import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
    createDiscussion,
    getDiscussionById,
    getDiscussionsByModuleId,
    updateDiscussion,
    deleteDiscussion,
    addCommentToDiscussion,
    likeDiscussion,
    unlikeDiscussion,
    likeComment,
    unlikeComment
} from "../services/db/discussion.db.service";
import { getModuleByName } from "../services/db/module.db.service";

export async function createDiscussionHandler(req: Request, res: Response) {
    try {
        const { title, content, moduleName } = req.body;
        const { id: creatorId } = res.locals.user;

        console.log(moduleName, "moduleName");


        if (!title || !content || !moduleName) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid request body",
            });
        }

        const module = await getModuleByName(moduleName);

        console.log(module, "module");

        const discussion = await createDiscussion({
            title,
            content,
            moduleId: module.id,
            creatorId,
        });

        return res.status(StatusCodes.CREATED).json(discussion);
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to create discussion",
        });
    }
}

export async function getDiscussionByIdHandler(req: Request, res: Response) {
    try {
        const { discussionId } = req.params;
        const { id: userId } = res.locals.user;

        const discussion = await getDiscussionById(discussionId, userId);

        return res.status(StatusCodes.OK).json(discussion);
    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === "Discussion not found") {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Discussion not found",
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to get discussion",
        });
    }
}

export async function getDiscussionsByModuleNameHandler(req: Request, res: Response) {
    try {
        const { moduleName } = req.params;
        const { id: userId } = res.locals.user;

        const module = await getModuleByName(moduleName);

        if (!module) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Module not found",
            });
        }

        const discussions = await getDiscussionsByModuleId(module.id, userId);

        return res.status(StatusCodes.OK).json(discussions);
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to get discussions",
        });
    }
}

export async function updateDiscussionHandler(req: Request, res: Response) {
    try {
        const { discussionId } = req.params;
        const { title, content } = req.body;

        if (!title && !content) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "No update data provided",
            });
        }

        const updatedDiscussion = await updateDiscussion(discussionId, { title, content });

        return res.status(StatusCodes.OK).json(updatedDiscussion);
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to update discussion",
        });
    }
}

export async function deleteDiscussionHandler(req: Request, res: Response) {
    try {
        const { discussionId } = req.params;

        await deleteDiscussion(discussionId);

        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to delete discussion",
        });
    }
}

export async function addCommentToDiscussionHandler(req: Request, res: Response) {
    try {
        const { discussionId } = req.params;
        const { content } = req.body;
        const { id: creatorId } = res.locals.user;

        if (!content) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Comment content is required",
            });
        }

        const comment = await addCommentToDiscussion(discussionId, { content, creatorId });

        return res.status(StatusCodes.CREATED).json(comment);
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to add comment to discussion",
        });
    }
}

export async function likeDiscussionHandler(req: Request, res: Response) {
    try {
        const { discussionId } = req.params;
        const { id: userId } = res.locals.user;

        await likeDiscussion(discussionId, userId);

        return res.status(StatusCodes.OK).json({
            message: "Discussion liked successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to like discussion",
        });
    }
}

export async function unlikeDiscussionHandler(req: Request, res: Response) {
    try {
        const { discussionId } = req.params;
        const { id: userId } = res.locals.user;

        await unlikeDiscussion(discussionId, userId);

        return res.status(StatusCodes.OK).json({
            message: "Discussion unliked successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to unlike discussion",
        });
    }
}

export async function likeCommentHandler(req: Request, res: Response) {
    try {
        const { commentId } = req.params;
        const { id: userId } = res.locals.user;

        await likeComment(parseInt(commentId), userId);

        return res.status(StatusCodes.OK).json({
            message: "Comment liked successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to like comment",
        });
    }
}

export async function unlikeCommentHandler(req: Request, res: Response) {
    try {
        const { commentId } = req.params;
        const { id: userId } = res.locals.user;

        await unlikeComment(parseInt(commentId), userId);

        return res.status(StatusCodes.OK).json({
            message: "Comment unliked successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to unlike comment",
        });
    }
}