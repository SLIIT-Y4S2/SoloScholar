import { Request, Response } from "express";
import { responseSythesizer } from "../services/rag.service";

const getOutput = async (req: Request, res: Response) => {
    const { userQuery } = req.body;
    const retrievedChunks = await responseSythesizer(userQuery);

    return res.status(200).json(retrievedChunks);
};

export { getOutput };