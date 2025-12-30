import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request) {
	try {
		const formData = await request.formData()

		// Extract form data
		const baseVideo = formData.get('baseVideo')
		const quoraLink = formData.get('quoraLink')
		const upvotes = formData.get('upvotes')
		const comments = formData.get('comments')
		const shares = formData.get('shares')
		const voiceQuestion = formData.get('voiceQuestion') || 'Freya'
		const voiceAnswer = formData.get('voiceAnswer') || 'Dennis'
		const language = formData.get('language') || 'en-IN'

		// Validate inputs
		if (!baseVideo || !quoraLink) {
			return NextResponse.json(
				{ error: 'Base video and Quora link are required' },
				{ status: 400 }
			)
		}

		// Create uploads directory if it doesn't exist
		const uploadsDir = path.join(process.cwd(), '..', 'uploads')
		if (!existsSync(uploadsDir)) {
			await mkdir(uploadsDir, { recursive: true })
		}

		// Save uploaded video
		const bytes = await baseVideo.arrayBuffer()
		const buffer = Buffer.from(bytes)
		const videoPath = path.join(uploadsDir, 'base.mp4')
		await writeFile(videoPath, buffer)

		// Create a job ID for tracking
		const jobId = Date.now().toString()

		// Prepare environment variables
		const env = {
			...process.env,
			QUORA_LINK: quoraLink,
			UPVOTES: upvotes,
			COMMENTS: comments,
			SHARES: shares,
			VOICE_QUESTION: voiceQuestion,
			VOICE_ANSWER: voiceAnswer,
			LANGUAGE: language,
			BASE_VIDEO_PATH: videoPath,
			JOB_ID: jobId,
		}

		// Run the video processing script in the background
		const scriptPath = path.join(process.cwd(), '..', 'src', 'index.ts')

		// Execute the script asynchronously
		execAsync(`cd .. && npm run start`, { env })
			.then(() => {
				console.log(`Job ${jobId} completed successfully`)
			})
			.catch(error => {
				console.error(`Job ${jobId} failed:`, error)
			})

		return NextResponse.json({
			success: true,
			message: 'Video processing started',
			jobId,
		})
	} catch (error) {
		console.error('Error processing video:', error)
		return NextResponse.json({ error: 'Failed to process video' }, { status: 500 })
	}
}
