/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/pricing',
                destination: '/',
                permanent: false,
            },
        ]
    },
}

module.exports = nextConfig
