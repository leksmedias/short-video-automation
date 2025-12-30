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
				GROQ_API_KEY: '',
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
			GROQ_API_KEY: envVars.GROQ_API_KEY || '',
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

# Groq API Key for Script Generation (Required)
# Get your API key from: https://console.groq.com
# Uses Kimi K2 Instruct model (moonshotai/kimi-k2-instruct-0905)
GROQ_API_KEY=${data.GROQ_API_KEY || ''}
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
