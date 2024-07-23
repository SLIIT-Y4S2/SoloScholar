import { Request, Response } from "express";
import { responseSynthesizerForLabs } from "../services/lab.rag.service";

async function getPracticalLabActivities(req: Request, res: Response) {
    const { topicOfTheLab } = req.body;

    try {
        const practicalLabData = await responseSynthesizerForLabs(topicOfTheLab);

        return res.status(200).json(practicalLabData);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            err.stack && console.error(err.stack);
        }
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        });
    }

};

async function evaluateStudentsAnswer(req: Request, res: Response) {

}

export { getPracticalLabActivities, evaluateStudentsAnswer };