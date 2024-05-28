const pathPrefix = process.env.NODE_ENV === 'production'
	? '/blog'
	: '';

module.exports = {
	assetPrefix: pathPrefix,
	env: {
		pathPrefix,
	},
};