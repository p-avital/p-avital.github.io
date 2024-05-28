// @ts-check

const { PHASE_DEVELOPMENT_SERVER } = require('next/dist/shared/lib/constants')


module.exports = async (phase, { defaultConfig }) => {
	/**
	 * @type {import('next').NextConfig}
	 */
	const nextConfig = {
	}
	if (phase != PHASE_DEVELOPMENT_SERVER) {
		nextConfig.basePath = "/blog"
	}
	return nextConfig
}