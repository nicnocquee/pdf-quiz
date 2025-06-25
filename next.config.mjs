import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

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

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: []
  }
});

export default withMDX(nextConfig);
