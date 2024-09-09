import { LearningLevel } from "../types/learning-material.types";
import { CognitiveLevel } from "../types/module.types";

interface Distribution {
  beginner: number;
  intermediate: number;
  advanced: number;
}

export const distributeQuestions = (
  learningLevel: LearningLevel,
  totalQuestions: number
): Distribution => {
  const distribution: Record<LearningLevel, Distribution> = {
    beginner: { beginner: 0.7, intermediate: 0.2, advanced: 0.1 },
    intermediate: { beginner: 0.2, intermediate: 0.6, advanced: 0.2 },
    advanced: { beginner: 0.1, intermediate: 0.2, advanced: 0.7 },
  };

  if (!distribution[learningLevel]) {
    throw new Error(
      "Invalid learning level. Choose from 'beginner', 'intermediate', 'advanced'."
    );
  }

  const percentages = distribution[learningLevel];

  if (totalQuestions < 3) {
    return {
      beginner: learningLevel === "beginner" ? totalQuestions : 0,
      intermediate: learningLevel === "intermediate" ? totalQuestions : 0,
      advanced: learningLevel === "advanced" ? totalQuestions : 0,
    };
  }

  const calculateQuestions = (percentage: number) =>
    Math.max(1, Math.round(totalQuestions * percentage));

  let numBeginner = calculateQuestions(percentages.beginner);
  let numIntermediate = calculateQuestions(percentages.intermediate);
  let numAdvanced = calculateQuestions(percentages.advanced);

  let difference =
    totalQuestions - (numBeginner + numIntermediate + numAdvanced);

  while (difference !== 0) {
    if (difference > 0) {
      numBeginner < totalQuestions - 2
        ? numBeginner++
        : numIntermediate < totalQuestions - 2
        ? numIntermediate++
        : numAdvanced++;
    } else {
      numBeginner > 1
        ? numBeginner--
        : numIntermediate > 1
        ? numIntermediate--
        : numAdvanced--;
    }
    difference = totalQuestions - (numBeginner + numIntermediate + numAdvanced);
  }

  return {
    beginner: numBeginner,
    intermediate: numIntermediate,
    advanced: numAdvanced,
  };
};

export const getHighestCognitiveLevel = (cognitiveLevel: CognitiveLevel[]) => {
  const bloomHierarchy = [
    "Remember",
    "Understand",
    "Apply",
    "Analyze",
    "Evaluate",
    "Create",
  ];

  // Find the highest level in the array
  const highest_cognitive_level = cognitiveLevel.reduce((highest, level) => {
    return bloomHierarchy.indexOf(level) > bloomHierarchy.indexOf(highest)
      ? level
      : highest;
  }, cognitiveLevel[0]);

  return highest_cognitive_level;
};
