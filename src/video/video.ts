import ffmpeg from 'fluent-ffmpeg'

import path from 'path'

export const mergeAudio = async ({
	videoFilePath,
	audioFilePath,
	outputVideoPath,
	subtitlePath,
}: {
	videoFilePath: string
	audioFilePath: string
	outputVideoPath: string
	subtitlePath: string
}) => {
	const videodata: any = await new Promise((resolve, reject) => {
		ffmpeg.ffprobe(videoFilePath, (err, videoMetadata) => {
			if (err) {
				console.error('Error getting video duration:', err.message)
				reject(err)
			}
			resolve(videoMetadata)
		})
	})

	const audiodata: any = await new Promise((resolve, reject) => {
		ffmpeg.ffprobe(audioFilePath, (err, audioMetadata) => {
			if (err) {
				console.error('Error getting audio duration:', err.message)
				reject(err)
			}
			resolve(audioMetadata)
		})
	})

	const videoDurationInSeconds = videodata.format.duration

	const audioDurationInSeconds = audiodata.format.duration

	const backgroundMusicFilePath = path.join(__dirname, '..', '..', 'bg.mp3')

	// Calculate how many times the video needs to be looped to match audio duration
	const loopCount = Math.ceil(audioDurationInSeconds! / videoDurationInSeconds!)

	console.log(`Video duration: ${videoDurationInSeconds}s, Audio duration: ${audioDurationInSeconds}s`)
	console.log(`Looping video ${loopCount} times to match audio length`)

	// Create video filter that loops the video and applies TikTok formatting with subtitles
	const tiktokFilterWithSubtitles =
		`loop=loop=${loopCount - 1}:size=1:start=0,scale=-1:1920:force_original_aspect_ratio=decrease,crop=1080:1920,subtitles=${subtitlePath}:force_style='Alignment=10,FontName=Trebuchet,FontSize=18,PrimaryColour=&Hffffff&,OutlineColour=&H00000000&,MarginV=25'`

	return new Promise((resolve, reject) => {
		// continue with the same part before

		ffmpeg()
			.input(videoFilePath)
			.input(audioFilePath)
			.input(backgroundMusicFilePath)
			.videoFilter(tiktokFilterWithSubtitles)
			.complexFilter([
				{
					filter: 'volume',
					options: 1,
					inputs: '1:a',
					outputs: 'volumeAdjustedAudio',
				},
				{
					filter: 'volume',
					options: 0.1,
					inputs: '2:a',
					outputs: 'volumeAdjustedBGM',
				},
				{
					filter: 'amix',
					options: { inputs: 2, duration: 'longest' },
					inputs: ['volumeAdjustedAudio', 'volumeAdjustedBGM'],
					outputs: 'amixed',
				},
			])
			.outputOptions([
				'-map',
				'0:v',
				'-map',
				'[amixed]',
				'-c:v',
				'libx264',
				'-c:a',
				'aac',
				'-shortest', // Trim video to match audio length exactly
			])
			.output(outputVideoPath)
			.on('start', commandLine => {
				console.log('Spawned Ffmpeg with command: ' + commandLine)
			})
			.on('end', () => {
				console.log('Audio added to video complete!')
				resolve('done')
			})
			.on('error', err => {
				console.error('Error during audio adding to video:', err)
				reject(err)
			})
			.run()
	})
}
