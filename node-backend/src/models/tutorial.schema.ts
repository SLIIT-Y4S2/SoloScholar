import { z } from "zod";

export const tutorialGenerationSchema = z.object({
  body: z.object({
    moduleName: z.string(),
    lessonTitle: z.string(),
    learningLevel: z.enum(["beginner", "intermediate", "advanced"]),
  }),
});

export type TutorialGenerationSchema = z.infer<typeof tutorialGenerationSchema>;

export const getTutorialsByLearnerSchema = z.object({
  query: z.object({
    moduleName: z.string(),
    lessonTitle: z.string(),
  }),
});

export type GetTutorialsByLearnerSchema = z.infer<
  typeof getTutorialsByLearnerSchema
>;

export const getTutorialByIdSchema = z.object({
  params: z.object({
    tutorialId: z.string(),
  }),
});

export type GetTutorialByIdSchema = z.infer<typeof getTutorialByIdSchema>;
