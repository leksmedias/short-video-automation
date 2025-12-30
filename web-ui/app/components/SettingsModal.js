'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave, FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi'

export default function SettingsModal({ isOpen, onClose }) {
	const [inworldApiKey, setInworldApiKey] = useState('')
	const [elevenLabApiKey, setElevenLabApiKey] = useState('')
	const [openaiApiKey, setOpenaiApiKey] = useState('')
	const [showInworld, setShowInworld] = useState(false)
	const [showEleven, setShowEleven] = useState(false)
	const [showOpenai, setShowOpenai] = useState(false)
	const [loading, setLoading] = useState(false)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	useEffect(() => {
		if (isOpen) {
			loadSettings()
		}
	}, [isOpen])

	const loadSettings = async () => {
		setLoading(true)
		try {
			const response = await fetch('/api/settings')
			if (response.ok) {
				const data = await response.json()
				setInworldApiKey(data.INWORLD_API_KEY || '')
				setElevenLabApiKey(data.ELEVEN_LAB_API || '')
				setOpenaiApiKey(data.OPENAI_API_KEY || '')
			}
		} catch (err) {
			setError('Failed to load settings')
		}
		setLoading(false)
	}

	const handleSave = async () => {
		setSaving(true)
		setError('')
		setSuccess('')

		try {
			const response = await fetch('/api/settings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					INWORLD_API_KEY: inworldApiKey,
					ELEVEN_LAB_API: elevenLabApiKey,
					OPENAI_API_KEY: openaiApiKey,
				}),
			})

			if (response.ok) {
				setSuccess('Settings saved successfully!')
				setTimeout(() => {
					onClose()
				}, 1500)
			} else {
				setError('Failed to save settings')
			}
		} catch (err) {
			setError('An error occurred while saving settings')
		}

		setSaving(false)
	}

	if (!isOpen) return null

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				{/* Backdrop */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
					className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				/>

				{/* Modal */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.9, y: 20 }}
					className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
				>
					{/* Header */}
					<div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
						<h2 className="text-2xl font-bold">API Settings</h2>
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
						>
							<FiX className="text-2xl" />
						</button>
					</div>

					{/* Content */}
					<div className="p-6 space-y-6">
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
							</div>
						) : (
							<>
								{/* Inworld API Key */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Inworld API Key{' '}
										<span className="text-blue-400">(Primary TTS)</span>
									</label>
									<div className="relative">
										<input
											type={showInworld ? 'text' : 'password'}
											value={inworldApiKey}
											onChange={e => setInworldApiKey(e.target.value)}
											placeholder="Enter your Inworld API key"
											className="w-full px-4 py-3 pr-12 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
										/>
										<button
											type="button"
											onClick={() => setShowInworld(!showInworld)}
											className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-800 rounded transition-colors"
										>
											{showInworld ? (
												<FiEyeOff className="text-gray-400" />
											) : (
												<FiEye className="text-gray-400" />
											)}
										</button>
									</div>
									<p className="text-xs text-gray-400 mt-2">
										Get your API key from{' '}
										<a
											href="https://studio.inworld.ai"
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-400 hover:underline"
										>
											studio.inworld.ai
										</a>
									</p>
								</div>

								{/* ElevenLabs API Key */}
								<div>
									<label className="block text-sm font-medium mb-2">
										ElevenLabs API Key{' '}
										<span className="text-gray-400">(Optional)</span>
									</label>
									<div className="relative">
										<input
											type={showEleven ? 'text' : 'password'}
											value={elevenLabApiKey}
											onChange={e => setElevenLabApiKey(e.target.value)}
											placeholder="Enter your ElevenLabs API key"
											className="w-full px-4 py-3 pr-12 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
										/>
										<button
											type="button"
											onClick={() => setShowEleven(!showEleven)}
											className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-800 rounded transition-colors"
										>
											{showEleven ? (
												<FiEyeOff className="text-gray-400" />
											) : (
												<FiEye className="text-gray-400" />
											)}
										</button>
									</div>
									<p className="text-xs text-gray-400 mt-2">
										Alternative TTS provider. Not required if using Inworld.
									</p>
								</div>

								{/* OpenAI API Key */}
								<div>
									<label className="block text-sm font-medium mb-2">
										OpenAI API Key{' '}
										<span className="text-gray-400">(For script generation)</span>
									</label>
									<div className="relative">
										<input
											type={showOpenai ? 'text' : 'password'}
											value={openaiApiKey}
											onChange={e => setOpenaiApiKey(e.target.value)}
											placeholder="Enter your OpenAI API key"
											className="w-full px-4 py-3 pr-12 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
										/>
										<button
											type="button"
											onClick={() => setShowOpenai(!showOpenai)}
											className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-800 rounded transition-colors"
										>
											{showOpenai ? (
												<FiEyeOff className="text-gray-400" />
											) : (
												<FiEye className="text-gray-400" />
											)}
										</button>
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
							</>
						)}
					</div>

					{/* Footer */}
					<div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex items-center justify-end gap-3">
						<button
							onClick={onClose}
							className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							disabled={saving}
							className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<FiSave />
							{saving ? 'Saving...' : 'Save Settings'}
						</button>
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
	)
}
