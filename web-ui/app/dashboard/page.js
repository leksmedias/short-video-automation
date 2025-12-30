'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	FiUpload,
	FiSettings,
	FiPlay,
	FiDownload,
	FiCheck,
	FiLoader,
	FiAlertCircle,
} from 'react-icons/fi'
import { BiVideoPlus } from 'react-icons/bi'
import { MdOutlineSubtitles } from 'react-icons/md'
import { HiOutlineSpeakerWave } from 'react-icons/hi2'
import VideoUploader from '../components/VideoUploader'
import SettingsModal from '../components/SettingsModal'
import ProcessingStatus from '../components/ProcessingStatus'

export default function Dashboard() {
	const [baseVideo, setBaseVideo] = useState(null)
	const [quoraLink, setQuoraLink] = useState('')
	const [upvotes, setUpvotes] = useState('')
	const [comments, setComments] = useState('')
	const [shares, setShares] = useState('')
	const [voiceQuestion, setVoiceQuestion] = useState('Freya')
	const [voiceAnswer, setVoiceAnswer] = useState('Dennis')
	const [language, setLanguage] = useState('en-IN')
	const [isProcessing, setIsProcessing] = useState(false)
	const [processingStatus, setProcessingStatus] = useState('')
	const [showSettings, setShowSettings] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const voices = [
		{ id: 'Dennis', name: 'Dennis (Male, Deep)', gender: 'male' },
		{ id: 'Freya', name: 'Freya (Female, Warm)', gender: 'female' },
		{ id: 'Marcus', name: 'Marcus (Male, Professional)', gender: 'male' },
		{ id: 'Lily', name: 'Lily (Female, Youthful)', gender: 'female' },
		{ id: 'Oliver', name: 'Oliver (Male, Friendly)', gender: 'male' },
		{ id: 'Emma', name: 'Emma (Female, Clear)', gender: 'female' },
	]

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')
		setSuccess('')

		if (!baseVideo) {
			setError('Please upload a base video')
			return
		}

		if (!quoraLink) {
			setError('Please provide a Quora link')
			return
		}

		setIsProcessing(true)
		setProcessingStatus('Uploading files...')

		try {
			const formData = new FormData()
			formData.append('baseVideo', baseVideo)
			formData.append('quoraLink', quoraLink)
			formData.append('upvotes', upvotes)
			formData.append('comments', comments)
			formData.append('shares', shares)
			formData.append('voiceQuestion', voiceQuestion)
			formData.append('voiceAnswer', voiceAnswer)
			formData.append('language', language)

			const response = await fetch('/api/process-video', {
				method: 'POST',
				body: formData,
			})

			const data = await response.json()

			if (response.ok) {
				setSuccess('Video processing started! This may take a few minutes.')
				setProcessingStatus('Processing video...')

				// Simulate processing steps
				setTimeout(() => setProcessingStatus('Generating audio with Inworld TTS...'), 2000)
				setTimeout(() => setProcessingStatus('Creating word-by-word subtitles...'), 5000)
				setTimeout(() => setProcessingStatus('Merging video and audio...'), 8000)
				setTimeout(() => setProcessingStatus('Applying effects and overlays...'), 11000)
				setTimeout(() => {
					setProcessingStatus('Complete!')
					setIsProcessing(false)
				}, 14000)
			} else {
				setError(data.error || 'Failed to process video')
				setIsProcessing(false)
			}
		} catch (err) {
			setError('An error occurred while processing the video')
			setIsProcessing(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
			{/* Header */}
			<header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<BiVideoPlus className="text-4xl text-blue-500" />
							<div>
								<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
									Short Video Automation
								</h1>
								<p className="text-sm text-gray-400">Create engaging videos automatically</p>
							</div>
						</div>
						<button
							onClick={() => setShowSettings(true)}
							className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600"
						>
							<FiSettings className="text-lg" />
							<span>Settings</span>
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8">
				<div className="grid lg:grid-cols-2 gap-8">
					{/* Left Column - Form */}
					<div className="space-y-6">
						{/* Video Upload */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm"
						>
							<div className="flex items-center gap-2 mb-4">
								<FiUpload className="text-xl text-blue-400" />
								<h2 className="text-xl font-semibold">Upload Base Video</h2>
							</div>
							<VideoUploader onVideoSelect={setBaseVideo} selectedVideo={baseVideo} />
						</motion.div>

						{/* Quora Details Form */}
						<motion.form
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							{/* Quora Link */}
							<div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
								<h2 className="text-xl font-semibold mb-4">Quora Details</h2>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											Quora Link <span className="text-red-400">*</span>
										</label>
										<input
											type="url"
											value={quoraLink}
											onChange={e => setQuoraLink(e.target.value)}
											placeholder="https://qr.ae/pKeRZp"
											className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
											required
										/>
									</div>

									<div className="grid grid-cols-3 gap-4">
										<div>
											<label className="block text-sm font-medium mb-2">Upvotes</label>
											<input
												type="text"
												value={upvotes}
												onChange={e => setUpvotes(e.target.value)}
												placeholder="839"
												className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium mb-2">Comments</label>
											<input
												type="text"
												value={comments}
												onChange={e => setComments(e.target.value)}
												placeholder="7"
												className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium mb-2">Shares</label>
											<input
												type="text"
												value={shares}
												onChange={e => setShares(e.target.value)}
												placeholder="3"
												className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Voice Settings */}
							<div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
								<div className="flex items-center gap-2 mb-4">
									<HiOutlineSpeakerWave className="text-xl text-purple-400" />
									<h2 className="text-xl font-semibold">Voice Settings</h2>
								</div>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											Question Voice (Inworld TTS)
										</label>
										<select
											value={voiceQuestion}
											onChange={e => setVoiceQuestion(e.target.value)}
											className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
										>
											{voices.map(voice => (
												<option key={voice.id} value={voice.id}>
													{voice.name}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											Answer Voice (Inworld TTS)
										</label>
										<select
											value={voiceAnswer}
											onChange={e => setVoiceAnswer(e.target.value)}
											className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
										>
											{voices.map(voice => (
												<option key={voice.id} value={voice.id}>
													{voice.name}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">Language</label>
										<select
											value={language}
											onChange={e => setLanguage(e.target.value)}
											className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
										>
											<option value="en-IN">English (India)</option>
											<option value="en-US">English (US)</option>
											<option value="en-GB">English (UK)</option>
										</select>
									</div>
								</div>
							</div>

							{/* Error/Success Messages */}
							<AnimatePresence>
								{error && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500 rounded-lg"
									>
										<FiAlertCircle className="text-red-400" />
										<p className="text-red-200">{error}</p>
									</motion.div>
								)}

								{success && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500 rounded-lg"
									>
										<FiCheck className="text-green-400" />
										<p className="text-green-200">{success}</p>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isProcessing}
								className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isProcessing ? (
									<>
										<FiLoader className="animate-spin text-xl" />
										Processing...
									</>
								) : (
									<>
										<FiPlay className="text-xl" />
										Generate Video
									</>
								)}
							</button>
						</motion.form>
					</div>

					{/* Right Column - Processing Status & Features */}
					<div className="space-y-6">
						{/* Processing Status */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<ProcessingStatus isProcessing={isProcessing} status={processingStatus} />
						</motion.div>

						{/* Features */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm"
						>
							<h2 className="text-xl font-semibold mb-4">Features</h2>
							<div className="space-y-4">
								<FeatureItem
									icon={<HiOutlineSpeakerWave />}
									title="Inworld TTS Integration"
									description="High-quality text-to-speech with word-level timestamps"
								/>
								<FeatureItem
									icon={<MdOutlineSubtitles />}
									title="Word-by-Word Subtitles"
									description="Perfectly synced subtitles with precise timing"
								/>
								<FeatureItem
									icon={<BiVideoPlus />}
									title="Smart Video Looping"
									description="Automatically loops video to match audio length"
								/>
								<FeatureItem
									icon={<FiCheck />}
									title="Automated Processing"
									description="Generate professional videos in minutes"
								/>
							</div>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Settings Modal */}
			<SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
		</div>
	)
}

function FeatureItem({ icon, title, description }) {
	return (
		<div className="flex items-start gap-3">
			<div className="text-2xl text-blue-400 mt-1">{icon}</div>
			<div>
				<h3 className="font-semibold">{title}</h3>
				<p className="text-sm text-gray-400">{description}</p>
			</div>
		</div>
	)
}
