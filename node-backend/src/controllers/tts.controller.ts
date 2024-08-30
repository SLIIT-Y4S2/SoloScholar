// backend/controllers/tts.controller.ts
import { Request, Response } from 'express';
import { getTTS } from '../services/tts.service';

export const getTTSHandler = async (req: Request, res: Response) => {
  const teacher = req.body.teacher as string || 'Ava';
  const text = req.body.text as string || "I'm excited to try text to speech";

  try {
    const ttsResult = await getTTS(teacher, text);
    res.json({ data: ttsResult }); // Wrap the result in a data property
  } catch (error: any) {
    res.status(500).json({ error: 'Error during TTS: ' + error.message });
  }
};