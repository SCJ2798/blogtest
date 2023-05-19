/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites(){
        return [
            {
                source:'/about',
                destination:'/'
            },
            {
                source:'/blog',
                destination:'/'
            }
        ];
    }
}

module.exports = nextConfig
