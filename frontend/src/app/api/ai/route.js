// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
// });

// const formalExample = {
//   lecture: [
//     {
//       subtopic: "introduction",
//       description:
//         "Hello, everyone! Today, we're going to learn about an amazing process that happens in plants called photosynthesis. Have you ever wondered how plants make their food? Well, they use sunlight, water, and carbon dioxide to create their food, and the process is called photosynthesis. Let's break it down into simple steps.",
//     },
//     {
//       subtopic: "light-dependent reactions",
//       description:
//         "The first step in photosynthesis is the light-dependent reactions. In this step, plants capture sunlight using a pigment called chlorophyll. The sunlight is then used to split water molecules into oxygen and hydrogen. The oxygen is released into the atmosphere, while the hydrogen is used to create energy-rich molecules called ATP and NADPH.",
//     },
//     {
//       subtopic: "Calvin cycle",
//       description:
//         "The second step in photosynthesis is the Calvin cycle. In this step, plants use the energy-rich molecules created in the light-dependent reactions to convert carbon dioxide into glucose. Glucose is a sugar that plants use as food to grow and thrive. This process is essential for all life on Earth, as it provides the oxygen we breathe and the food we eat.",
//     },
//     {
//       subtopic: "conclusion",
//       description:
//         "In conclusion, photosynthesis is a fascinating process that sustains life on Earth. By capturing sunlight and converting it into food, plants play a crucial role in the ecosystem. I hope you've enjoyed learning about photosynthesis today. Thank you for your attention!",
//     },
//   ],
// };

// const casualExample = {
//   lecture: [
//     "Good afternoon, everyone. Today, we'll delve into the intricate process of photosynthesis, a fundamental biochemical process that sustains most life on Earth. We'll examine the two primary stages: the light-dependent reactions and the Calvin cycle.",
//   ],
// };

// export async function GET(req) {
//   // WARNING: Do not expose your keys
//   // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of ChatGPT resources

//   const speech = req.nextUrl.searchParams.get("speech") || "formal";
//   const speechExample = speech === "formal" ? formalExample : casualExample;

//   const chatCompletion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content: `You are a teacher. 
// Your student asks you to do a lecture. if student is a beginner student give lecture as json output ex : ${JSON.stringify(
//           formalExample
//         )}
// if student is a expert student give lecture as ex: ${JSON.stringify(
//           casualExample
//         )}
// `,
//       },
//       {
//         role: "user",
//         content: `Do a 5 minutes lecture reagarding ${
//           req.nextUrl.searchParams.get("question") ||
//           "Have you ever been to Japan?"
//         } for a ${speech} student`,
//       },
//     ],
//     // model: "gpt-4-turbo-preview", // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
//     model: "gpt-3.5-turbo", // https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4
//     // response_format: {
//     //   type: "json_object",
//     // },
//   });
//   console.log(chatCompletion.choices[0].message.content);
//   return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
// }
