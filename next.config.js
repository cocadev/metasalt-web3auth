/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['metasalt.io', 'minedn.io', 'ipfs.io', 'ipfs.moralis.io', 'nftavatarmaker.com', 'lh3.googleusercontent.com']
  },
}

module.exports = nextConfig
