/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow iframe embedding from any origin (for Educativa LMS)
  async headers() {
    return [
      {
        source: '/embed',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
