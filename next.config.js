/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/pricing',
                destination: '/',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
