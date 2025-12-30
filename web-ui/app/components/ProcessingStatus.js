'use client'

import { motion } from 'framer-motion'
import { FiLoader, FiCheck, FiClock } from 'react-icons/fi'
import { HiOutlineSpeakerWave } from 'react-icons/hi2'
import { MdOutlineSubtitles } from 'react-icons/md'
import { BiVideoPlus } from 'react-icons/bi'

export default function ProcessingStatus({ isProcessing, status }) {
	const steps = [
		{ id: 1, name: 'Uploading files', icon: <FiClock /> },
		{ id: 2, name: 'Generating audio with Inworld TTS', icon: <HiOutlineSpeakerWave /> },
		{ id: 3, name: 'Creating word-by-word subtitles', icon: <MdOutlineSubtitles /> },
		{ id: 4, name: 'Merging video and audio', icon: <BiVideoPlus /> },
		{ id: 5, name: 'Applying effects and overlays', icon: <BiVideoPlus /> },
	]

	const getCurrentStep = () => {
		if (!status) return 0
		if (status.includes('Uploading')) return 1
		if (status.includes('audio') || status.includes('TTS')) return 2
		if (status.includes('subtitle')) return 3
		if (status.includes('Merging')) return 4
		if (status.includes('effects') || status.includes('overlay')) return 5
		if (status.includes('Complete')) return 6
		return 0
	}

	const currentStep = getCurrentStep()

	return (
		<div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold">Processing Status</h2>
				{isProcessing && (
					<div className="flex items-center gap-2 text-blue-400">
						<FiLoader className="animate-spin" />
						<span className="text-sm">Processing...</span>
					</div>
				)}
			</div>

			{!isProcessing && !status ? (
				<div className="text-center py-12 text-gray-400">
					<BiVideoPlus className="text-6xl mx-auto mb-4 opacity-20" />
					<p>Upload a video and start processing to see progress</p>
				</div>
			) : (
				<div className="space-y-4">
					{steps.map(step => {
						const isComplete = currentStep > step.id
						const isCurrent = currentStep === step.id
						const isPending = currentStep < step.id

						return (
							<motion.div
								key={step.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: step.id * 0.1 }}
								className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
									isCurrent
										? 'bg-blue-500/20 border border-blue-500'
										: isComplete
										? 'bg-green-500/10 border border-green-500/50'
										: 'bg-gray-900/50 border border-gray-700'
								}`}
							>
								<div
									className={`text-2xl ${
										isCurrent
											? 'text-blue-400'
											: isComplete
											? 'text-green-400'
											: 'text-gray-500'
									}`}
								>
									{isComplete ? (
										<FiCheck />
									) : isCurrent ? (
										<FiLoader className="animate-spin" />
									) : (
										step.icon
									)}
								</div>
								<div className="flex-1">
									<p
										className={`font-medium ${
											isCurrent
												? 'text-blue-200'
												: isComplete
												? 'text-green-200'
												: 'text-gray-400'
										}`}
									>
										{step.name}
									</p>
									{isCurrent && (
										<p className="text-sm text-blue-300/70 mt-1">In progress...</p>
									)}
									{isComplete && (
										<p className="text-sm text-green-300/70 mt-1">Completed</p>
									)}
								</div>
								<div
									className={`w-2 h-2 rounded-full ${
										isCurrent
											? 'bg-blue-400 animate-pulse'
											: isComplete
											? 'bg-green-400'
											: 'bg-gray-600'
									}`}
								/>
							</motion.div>
						)
					})}

					{/* Progress Bar */}
					<div className="mt-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-400">Overall Progress</span>
							<span className="text-sm font-semibold text-blue-400">
								{Math.round((currentStep / steps.length) * 100)}%
							</span>
						</div>
						<div className="h-2 bg-gray-900 rounded-full overflow-hidden">
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: `${(currentStep / steps.length) * 100}%` }}
								transition={{ duration: 0.5 }}
								className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
							/>
						</div>
					</div>

					{/* Current Status */}
					{status && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="mt-4 p-4 bg-gray-900 rounded-lg"
						>
							<p className="text-sm text-gray-300">{status}</p>
						</motion.div>
					)}
				</div>
			)}
		</div>
	)
}
