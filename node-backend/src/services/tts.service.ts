// backend/services/tts.service.ts
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough } from 'stream';

export const getTTS = async (teacher: string, text: string) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env['SPEECH_KEY'] || '',
        process.env['SPEECH_REGION'] || ''
    );

    speechConfig.speechSynthesisVoiceName = `en-US-${teacher}Neural`;

    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
    const visemes: [number, number][] = [];
    speechSynthesizer.visemeReceived = function (s, e) {
        visemes.push([e.audioOffset / 10000, e.visemeId]);
    };

    try {
        const audioStream = await new Promise<PassThrough>((resolve, reject) => {
            speechSynthesizer.speakTextAsync(
                text,
                (result) => {
                    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                        const { audioData } = result;
                        speechSynthesizer.close();

                        if (!audioData) {
                            reject(new Error('No audio data received'));
                            return;
                        }

                        // convert arrayBuffer to stream
                        const bufferStream = new PassThrough();
                        bufferStream.end(Buffer.from(audioData));
                        resolve(bufferStream);
                    } else {
                        speechSynthesizer.close();
                        reject(new Error(`Speech synthesis failed. Reason: ${result.reason}`));
                    }
                },
                (error) => {
                    speechSynthesizer.close();
                    reject(error);
                }
            );
        });

        // Convert audioStream to base64
        const audioChunks: Buffer[] = [];
        for await (const chunk of audioStream) {
            audioChunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(audioChunks);
        const audioBase64 = audioBuffer.toString('base64');

        // return  {
        //     audioBase64,
        //     visemes,
        // };

        const responseData = {
      audioBase64,
      visemes,
    };

        


        // const response = new Response(JSON.stringify(responseData), {
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // });

        return responseData;
    } catch (error) {
        console.error('Error during TTS:', error);
        throw error;
    }
};