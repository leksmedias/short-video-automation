'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiVideo, FiX, FiCheck } from 'react-icons/fi'

export default function VideoUploader({ onVideoSelect, selectedVideo }) {
	const [dragActive, setDragActive] = useState(false)
	const [previewUrl, setPreviewUrl] = useState(null)
	const fileInputRef = useRef(null)

	const handleDrag = e => {
		e.preventDefault()
		e.stopPropagation()
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true)
		} else if (e.type === 'dragleave') {
			setDragActive(false)
		}
	}

	const handleDrop = e => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFile(e.dataTransfer.files[0])
		}
	}

	const handleChange = e => {
		e.preventDefault()
		if (e.target.files && e.target.files[0]) {
			handleFile(e.target.files[0])
		}
	}

	const handleFile = file => {
		// Validate file type
		if (!file.type.startsWith('video/')) {
			alert('Please upload a video file')
			return
		}

		// Validate file size (max 100MB)
		if (file.size > 100 * 1024 * 1024) {
			alert('File size must be less than 100MB')
			return
		}

		onVideoSelect(file)

		// Create preview URL
		const url = URL.createObjectURL(file)
		setPreviewUrl(url)
	}

	const handleRemove = () => {
		onVideoSelect(null)
		setPreviewUrl(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const openFileDialog = () => {
		fileInputRef.current?.click()
	}

	return (
		<div className="w-full">
			<input
				ref={fileInputRef}
				type="file"
				accept="video/*"
				onChange={handleChange}
				className="hidden"
			/>

			{!selectedVideo ? (
				<motion.div
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}
					onClick={openFileDialog}
					whileHover={{ scale: 1.02 }}
					className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
						dragActive
							? 'border-blue-500 bg-blue-500/10'
							: 'border-gray-600 hover:border-gray-500 bg-gray-900/50'
					}`}
				>
					<div className="flex flex-col items-center gap-4">
						<div
							className={`p-4 rounded-full ${
								dragActive ? 'bg-blue-500/20' : 'bg-gray-800'
							}`}
						>
							<FiUpload
								className={`text-4xl ${dragActive ? 'text-blue-400' : 'text-gray-400'}`}
							/>
						</div>
						<div>
							<p className="text-lg font-semibold mb-1">
								{dragActive ? 'Drop video here' : 'Upload base video'}
							</p>
							<p className="text-sm text-gray-400">
								Drag and drop or click to browse
							</p>
							<p className="text-xs text-gray-500 mt-2">MP4, MOV, AVI (Max 100MB)</p>
						</div>
					</div>
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700"
				>
					{/* Video Preview */}
					<div className="relative aspect-video bg-black">
						{previewUrl && (
							<video
								src={previewUrl}
								controls
								className="w-full h-full object-contain"
							/>
						)}
					</div>

					{/* Video Info */}
					<div className="p-4 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-500/20 rounded-lg">
								<FiCheck className="text-green-400 text-xl" />
							</div>
							<div>
								<p className="font-semibold">{selectedVideo.name}</p>
								<p className="text-sm text-gray-400">
									{(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
								</p>
							</div>
						</div>
						<button
							onClick={handleRemove}
							className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
						>
							<FiX className="text-xl text-gray-400 hover:text-red-400" />
						</button>
					</div>
				</motion.div>
			)}
		</div>
	)
}
