/** @type {import("next").NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      },
      {
        protocol: 'https',
        hostname: 'my-blob-store.public.blob.vercel-storage.com',
        port: '',
      },
    ]
  }
};

export default withPWA({
  dest: "public",         // destination directory for the PWA files
  disable: process.env.NODE_ENV === "development",        // disable PWA in the development environment
  register: true,         // register the PWA service worker
  skipWaiting: true,      // skip waiting for service worker activation
})(nextConfig);