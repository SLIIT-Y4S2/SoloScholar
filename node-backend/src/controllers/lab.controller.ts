import { Request, Response } from "express";
import { responseSythesizerForLabs } from "../services/lab.rag.service";

const getPracticalLabActivities = async (req: Request, res: Response) => {
    const { topicOfTheLab } = req.body;
    const retrievedChunks = await responseSythesizerForLabs(topicOfTheLab);

    return res.status(200).json(retrievedChunks);
};

export { getPracticalLabActivities };