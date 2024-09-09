// import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// import { PassThrough } from "stream";

// export async function GET(req) {
//   // WARNING: Do not expose your keys
//   // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of Azure resources

//   const speechConfig = sdk.SpeechConfig.fromSubscription(
//     process.env["SPEECH_KEY"],
//     process.env["SPEECH_REGION"]
//   );

//   const teacher = req.nextUrl.searchParams.get("teacher") || "Ava";
//   const text = req.nextUrl.searchParams.get("text") || "I'm excited to try text to speech";

//   speechConfig.speechSynthesisVoiceName = `en-US-${teacher}Neural`;

//   const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
//   const visemes = [];
//   speechSynthesizer.visemeReceived = function (s, e) {
//     visemes.push([e.audioOffset / 10000, e.visemeId]);
//   };

//   try {
//     const audioStream = await new Promise((resolve, reject) => {
//       speechSynthesizer.speakTextAsync(
//         text,
//         (result) => {
//           if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
//             const { audioData } = result;
//             speechSynthesizer.close();

//             if (!audioData) {
//               reject(new Error("No audio data received"));
//               return;
//             }

//             // convert arrayBuffer to stream
//             const bufferStream = new PassThrough();
//             bufferStream.end(Buffer.from(audioData));
//             resolve(bufferStream);
//           } else {
//             speechSynthesizer.close();
//             reject(new Error(`Speech synthesis failed. Reason: ${result.reason}`));
//           }
//         },
//         (error) => {
//           speechSynthesizer.close();
//           reject(error);
//         }
//       );
//     });

//     // Convert audioStream to base64
//     const audioChunks = [];
//     for await (const chunk of audioStream) {
//       audioChunks.push(chunk);
//     }
//     const audioBuffer = Buffer.concat(audioChunks);
//     const audioBase64 = audioBuffer.toString('base64');

//     const responseData = {
//       audioBase64,
//       visemes,
//     };

//     const response = new Response(JSON.stringify(responseData), {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     return response;
//   } catch (error) {
//     console.error("Error during TTS:", error);

//     return new Response("Error during TTS: " + error.message, {
//       status: 500,
//       headers: {
//         "Content-Type": "text/plain",
//       },
//     });
//   }
// }
