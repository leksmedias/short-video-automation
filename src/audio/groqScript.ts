import Groq from 'groq-sdk'

const GROQ_API_KEY = process.env.GROQ_API_KEY

if (!GROQ_API_KEY) {
	console.warn('GROQ_API_KEY not found in environment variables')
}

const groq = new Groq({
	apiKey: GROQ_API_KEY,
})

/**
 * Generate a video script using Groq's Kimi 2 model
 */
export const createShortScriptWithGroq = async ({
	language,
	topic,
}: {
	language: string
	topic: string
}): Promise<string | null> => {
	try {
		console.log('Creating script with Groq (Kimi 2)...')

		const prompt = `You are an expert video writer. You ONLY produce text that is read. You only produce the script that will be read by a voice actor for a video. The user will give you the description of the video they want you to make and from that, you will write the script. Make sure to directly write the script in response to the video description.

Your script will not have any reference to the audio footage / video footage shown. Only the text that will be narrated by the voice actor.

You will produce purely text.
Don't write any other textual thing than the text itself.
Make sure the text is not longer than "150" words (keep the video pretty short and neat).

Language: ${language}
Topic: ${topic}

# Output
You will output the script in a JSON format of this kind, and only a parsable JSON object.
Use "script" as key for the json object for script.
For example like this: {"script":"do you know .... "}

Only return valid JSON, nothing else.`

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
			model: 'moonshotai/kimi-k2-instruct-0905', // Using Kimi K2 Instruct model via Groq
			temperature: 0.7,
			max_tokens: 500,
		})

		const response = completion.choices[0]?.message?.content

		if (!response) {
			throw new Error('No response from Groq')
		}

		// Parse JSON response
		const parsed = JSON.parse(response)

		if (!parsed.script) {
			throw new Error('Script not found in response')
		}

		console.log('Script generated successfully with Groq')
		return parsed.script
	} catch (error: any) {
		console.error('Error in createShortScriptWithGroq:', error.message)
		return null
	}
}

/**
 * Summarize a long script (e.g., from Quora) using Groq's Kimi 2 model
 */
export const summarizeScriptWithGroq = async ({
	script,
}: {
	script: string
}): Promise<string | null> => {
	try {
		console.log('Summarizing script with Groq (Kimi 2)...')

		const prompt = `You are a scripter for an Instagram creator. Your work is to summarize the script into 150 words.
Make sure the text is not longer than "150" words (keep the video pretty short and neat).

The script is mostly a question and answer type of script.

Script: ${script}

# Output
You will output the script in a JSON format of this kind, and only a parsable JSON object.
Use "script" as key for the json object for script.
For example: {"script":"...."}

Only return valid JSON, nothing else.`

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
			model: 'moonshotai/kimi-k2-instruct-0905', // Using Kimi K2 Instruct model via Groq
			temperature: 0.1, // Lower temperature for more precise summarization
			max_tokens: 500,
		})

		const response = completion.choices[0]?.message?.content

		if (!response) {
			throw new Error('No response from Groq')
		}

		// Parse JSON response
		const parsed = JSON.parse(response)

		if (!parsed.script) {
			throw new Error('Script not found in response')
		}

		console.log('Script summarized successfully with Groq')
		return parsed.script
	} catch (error: any) {
		console.error('Error in summarizeScriptWithGroq:', error.message)
		return null
	}
}

/**
 * Generate script with streaming support
 */
export const createScriptWithGroqStream = async ({
	language,
	topic,
	onChunk,
}: {
	language: string
	topic: string
	onChunk?: (text: string) => void
}): Promise<string | null> => {
	try {
		console.log('Creating script with Groq (streaming)...')

		const prompt = `You are an expert video writer. Create a concise video script (max 150 words) for:
Language: ${language}
Topic: ${topic}

Return only valid JSON: {"script":"your script here"}`

		const stream = await groq.chat.completions.create({
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
			model: 'moonshotai/kimi-k2-instruct-0905', // Using Kimi K2 Instruct model via Groq
			temperature: 0.7,
			max_tokens: 500,
			stream: true,
		})

		let fullResponse = ''

		for await (const chunk of stream) {
			const content = chunk.choices[0]?.delta?.content || ''
			fullResponse += content

			if (onChunk && content) {
				onChunk(content)
			}
		}

		// Parse JSON response
		const parsed = JSON.parse(fullResponse)
		return parsed.script || null
	} catch (error: any) {
		console.error('Error in createScriptWithGroqStream:', error.message)
		return null
	}
}
