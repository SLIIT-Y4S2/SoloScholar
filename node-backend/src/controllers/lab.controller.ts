import { Request, Response } from "express";
import { responseSynthesizerForLabs } from "../services/lab.rag.service";

const getPracticalLabActivities = async (req: Request, res: Response) => {
    const { topicOfTheLab } = req.body;
 
    // TODO - Handle the errors gracefully
    try {
        const practicalLabData = await responseSynthesizerForLabs(topicOfTheLab);

        return res.status(200).json(practicalLabData);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            err.stack && console.error(err.stack);
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
   
};

export { getPracticalLabActivities };