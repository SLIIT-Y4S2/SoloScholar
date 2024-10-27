import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough } from 'stream';

export const getTTS = async (teacher: string, text: string, speechRate: number = 0.9) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env['SPEECH_KEY'] || '',
        process.env['SPEECH_REGION'] || ''
    );

    speechConfig.speechSynthesisVoiceName = `en-US-${teacher}Neural`;

    // Create SSML with speech rate
    const ssml = `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" 
               xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
            <voice name="en-US-${teacher}Neural">
                <prosody rate="${speechRate}">
                    ${text}
                </prosody>
            </voice>
        </speak>
    `;

    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
    const visemes: [number, number][] = [];
    speechSynthesizer.visemeReceived = function (s, e) {
        visemes.push([e.audioOffset / 10000, e.visemeId]);
    };

    try {
        const audioStream = await new Promise<PassThrough>((resolve, reject) => {
            speechSynthesizer.speakSsmlAsync(  // Changed from speakTextAsync to speakSsmlAsync
                ssml,
                (result) => {
                    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                        const { audioData } = result;
                        speechSynthesizer.close();

                        if (!audioData) {
                            reject(new Error('No audio data received'));
                            return;
                        }

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

        const audioChunks: Buffer[] = [];
        for await (const chunk of audioStream) {
            audioChunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(audioChunks);
        const audioBase64 = audioBuffer.toString('base64');

        return {
            audioBase64,
            visemes,
        };
    } catch (error) {
        console.error('Error during TTS:', error);
        throw error;
    }
};