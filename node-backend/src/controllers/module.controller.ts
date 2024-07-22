import { Request, Response } from "express";
import { createModule } from "../services/db/module.db.service";

export const createModuleHandler = async (req: Request, res: Response) => {
  try {
    const module = await createModule(req.body);

    res.status(201).json({
      message: "Module created successfully",
      data: module,
    });
  } catch (error) {
    res.status(500).json((error as Error).message);

    console.error(error);
  }
};
