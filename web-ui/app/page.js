'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
	const router = useRouter()

	useEffect(() => {
		// Redirect to dashboard
		router.push('/dashboard')
	}, [router])

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			<div className="text-center">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4" />
				<p className="text-gray-400">Loading dashboard...</p>
			</div>
		</div>
	)
}
