/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
      },
      {
        protocol: 'http',
        hostname: 'images.squarespace-cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'static1.squarespace.com',
      },
    ],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/conley-group',
        destination: '/business-overview',
        permanent: false,
      },
      {
        source: '/about',
        destination: '/foreword',
        permanent: false,
      },
      {
        source: '/biographies',
        destination: '/benjamin-conley',
        permanent: false,
      },
      {
        source: '/news-info',
        destination: '/contact-form',
        permanent: false,
      },
      {
        source: '/main',
        destination: '/business-overview',
        permanent: false,
      },
      {
        source: '/horse-breeding',
        destination: '/roxanne-davis-greene-feature',
        permanent: false,
      },
      {
        source: '/equestrian',
        destination: '/michele-davis-macfarlane',
        permanent: false,
      },
      {
        source: '/conley-map',
        destination: '/1800-1820',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
