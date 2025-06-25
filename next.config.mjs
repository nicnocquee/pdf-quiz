/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/id",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
