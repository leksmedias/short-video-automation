import { NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const ENV_PATH = path.join(process.cwd(), '..', '.env')

export async function GET() {
	try {
		if (!existsSync(ENV_PATH)) {
			return NextResponse.json({
				INWORLD_API_KEY: '',
				ELEVEN_LAB_API: '',
				OPENAI_API_KEY: '',
			})
		}

		const envContent = await readFile(ENV_PATH, 'utf-8')
		const envVars = {}

		envContent.split('\n').forEach(line => {
			const [key, value] = line.split('=')
			if (key && value) {
				envVars[key.trim()] = value.trim()
			}
		})

		return NextResponse.json({
			INWORLD_API_KEY: envVars.INWORLD_API_KEY || '',
			ELEVEN_LAB_API: envVars.ELEVEN_LAB_API || '',
			OPENAI_API_KEY: envVars.OPENAI_API_KEY || '',
		})
	} catch (error) {
		console.error('Error reading settings:', error)
		return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 })
	}
}

export async function POST(request) {
	try {
		const data = await request.json()

		const envContent = `# Inworld API Key for Text-to-Speech (Required)
# Get your API key from: https://studio.inworld.ai
INWORLD_API_KEY=${data.INWORLD_API_KEY || ''}

# Optional: ElevenLabs API (if you want to use ElevenLabs instead)
ELEVEN_LAB_API=${data.ELEVEN_LAB_API || ''}

# OpenAI API Key (for script generation)
OPENAI_API_KEY=${data.OPENAI_API_KEY || ''}
`

		await writeFile(ENV_PATH, envContent)

		return NextResponse.json({
			success: true,
			message: 'Settings saved successfully',
		})
	} catch (error) {
		console.error('Error saving settings:', error)
		return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
	}
}
