/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // A stray lockfile in a parent directory otherwise makes Next guess the wrong workspace root.
  turbopack: { root: import.meta.dirname },
};
export default nextConfig;
