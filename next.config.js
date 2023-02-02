/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['metasalt.io', 'minedn.io', 'ipfs.io', 'ipfs.moralis.io', 'nftavatarmaker.com', 'lh3.googleusercontent.com']
  },
}

module.exports = nextConfig
