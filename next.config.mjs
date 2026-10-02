/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/contact-us.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/about.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/services.html',
        destination: '/veiculos',
        permanent: true,
      },
      {
        source: '/get-started',
        destination: '/veiculos',
        permanent: true,
      },
      {
        source: '/services/:path*',
        destination: '/veiculos',
        permanent: true,
      },
      {
        source: '/solutions/:path*',
        destination: '/veiculos',
        permanent: true,
      },
      {
        source: '/resources/:path*',
        destination: '/veiculos',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
