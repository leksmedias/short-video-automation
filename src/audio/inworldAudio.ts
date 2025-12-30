import axios from 'axios'
import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import ffmpeg from 'fluent-ffmpeg'

const INWORLD_API_KEY = process.env.INWORLD_API_KEY

if (!INWORLD_API_KEY) {
	console.warn('INWORLD_API_KEY not found in environment variables')
}

const inworldAPI = 'https://api.inworld.ai'

export interface WordAlignment {
	words: string[]
	wordStartTimeSeconds: number[]
	wordEndTimeSeconds: number[]
}

export interface InworldTTSResponse {
	audioContent: string // base64 encoded audio
	timestampInfo?: {
		wordAlignment?: WordAlignment
	}
}

export const createAudioWithInworld = async ({
	script,
	voiceId = 'Dennis',
	modelId = 'inworld-tts-1',
	outputFilePath = 'basicaudio.mp3',
	temperature = 1.1,
	audioEncoding = 'MP3',
	sampleRateHertz = 22050,
	speakingRate = 1.0,
}: {
	script: string
	voiceId?: string
	modelId?: 'inworld-tts-1' | 'inworld-tts-1-max'
	outputFilePath?: string
	temperature?: number
	audioEncoding?: 'LINEAR16' | 'MP3' | 'OGG_OPUS' | 'ALAW' | 'MULAW' | 'FLAC'
	sampleRateHertz?: number
	speakingRate?: number
}): Promise<WordAlignment | null> => {
	try {
		if (!INWORLD_API_KEY) {
			throw new Error('INWORLD_API_KEY not found')
		}

		const response = await axios({
			method: 'POST',
			url: `${inworldAPI}/tts/v1/voice`,
			data: {
				text: script,
				voiceId: voiceId,
				modelId: modelId,
				temperature: temperature,
				timestampType: 'WORD', // Enable word-level timestamps
				audioConfig: {
					audioEncoding: audioEncoding,
					sampleRateHertz: sampleRateHertz,
					speakingRate: speakingRate,
				},
			},
			headers: {
				Authorization: `Basic ${INWORLD_API_KEY}`,
				'Content-Type': 'application/json',
			},
		})

		const result: InworldTTSResponse = response.data

		// Decode base64 audio content
		const audioBuffer = Buffer.from(result.audioContent, 'base64')

		// Write audio file
		await fs.writeFile(outputFilePath, audioBuffer)
		console.log('Audio file created with Inworld TTS:', outputFilePath)

		// Convert to WAV if needed (for compatibility with existing pipeline)
		if (outputFilePath.endsWith('.mp3')) {
			const wavPath = outputFilePath.replace('.mp3', '.wav')
			await convertInworldToWav(outputFilePath, wavPath)
		}

		// Return word alignment data for subtitle generation
		return result.timestampInfo?.wordAlignment || null
	} catch (error: any) {
		console.error('Error in createAudioWithInworld:', error.response?.data || error.message)
		throw error
	}
}

/**
 * Generate VTT subtitle file from Inworld word alignment data
 */
export const generateVTTFromWordAlignment = async (
	wordAlignment: WordAlignment,
	outputVTTPath: string
): Promise<void> => {
	try {
		let vttContent = 'WEBVTT\n\n'

		const { words, wordStartTimeSeconds, wordEndTimeSeconds } = wordAlignment

		// Group words into subtitle chunks (e.g., 5-8 words per subtitle)
		const wordsPerSubtitle = 6
		for (let i = 0; i < words.length; i += wordsPerSubtitle) {
			const chunkWords = words.slice(i, i + wordsPerSubtitle)
			const startTime = wordStartTimeSeconds[i]
			const endTime = wordEndTimeSeconds[Math.min(i + wordsPerSubtitle - 1, words.length - 1)]

			// Format timestamps as HH:MM:SS.mmm
			const startFormatted = formatVTTTime(startTime)
			const endFormatted = formatVTTTime(endTime)

			// Create subtitle entry
			vttContent += `${startFormatted} --> ${endFormatted}\n`
			vttContent += `${chunkWords.join(' ')}\n\n`
		}

		await fs.writeFile(outputVTTPath, vttContent)
		console.log('VTT subtitle file created:', outputVTTPath)
	} catch (error) {
		console.error('Error generating VTT file:', error)
		throw error
	}
}

/**
 * Convert Inworld MP3 output to WAV format
 */
export const convertInworldToWav = async (
	inputFilePath: string,
	outputFilePath: string
): Promise<void> => {
	console.log('Converting Inworld audio to WAV:', inputFilePath, '->', outputFilePath)
	return new Promise((resolve, reject) => {
		ffmpeg(inputFilePath)
			.toFormat('wav')
			.audioFrequency(16000)
			.output(outputFilePath)
			.on('end', () => {
				console.log('Audio converted to WAV')
				resolve()
			})
			.on('error', err => {
				console.error('Error converting audio to WAV:', err.message)
				reject(err)
			})
			.run()
	})
}

/**
 * Format seconds to VTT timestamp format (HH:MM:SS.mmm)
 */
function formatVTTTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const secs = Math.floor(seconds % 60)
	const milliseconds = Math.floor((seconds % 1) * 1000)

	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`
}

/**
 * Generate word-by-word VTT for karaoke-style highlighting
 */
export const generateWordByWordVTT = async (
	wordAlignment: WordAlignment,
	outputVTTPath: string
): Promise<void> => {
	try {
		let vttContent = 'WEBVTT\n\n'

		const { words, wordStartTimeSeconds, wordEndTimeSeconds } = wordAlignment

		// Create individual subtitle for each word
		for (let i = 0; i < words.length; i++) {
			const startFormatted = formatVTTTime(wordStartTimeSeconds[i])
			const endFormatted = formatVTTTime(wordEndTimeSeconds[i])

			vttContent += `${startFormatted} --> ${endFormatted}\n`
			vttContent += `${words[i]}\n\n`
		}

		await fs.writeFile(outputVTTPath, vttContent)
		console.log('Word-by-word VTT subtitle file created:', outputVTTPath)
	} catch (error) {
		console.error('Error generating word-by-word VTT file:', error)
		throw error
	}
}
