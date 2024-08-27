import { z } from "zod";

export const lectureGenerationSchema = z.object({
  body: z.object({
    moduleName: z.string(),
    lessonTitle: z.string(),
    learningLevel: z.enum(["beginner", "intermediate", "advanced"]),
  }),
});

export type LectureGenerationSchema = z.infer<typeof lectureGenerationSchema>;

export const getLecturesByLearnerSchema = z.object({
  query: z.object({
    moduleName: z.string(),
    lessonTitle: z.string(),
  }),
});

export type GetLecturesByLearnerSchema = z.infer<
  typeof getLecturesByLearnerSchema
>;

export const getLectureByIdSchema = z.object({
  params: z.object({
    lectureId: z.string(),
  }),
});

export type GetLectureByIdSchema = z.infer<typeof getLectureByIdSchema>;
