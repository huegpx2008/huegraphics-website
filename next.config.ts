import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/company",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/signs%2C-banners-%26-more",
        destination: "/signs-banners",
        permanent: true,
      },
      {
        source: "/signs,-banners-&-more",
        destination: "/signs-banners",
        permanent: true,
      },
      {
        source: "/signs-banners-more",
        destination: "/signs-banners",
        permanent: true,
      },
      {
        source: "/signs-banners-and-more",
        destination: "/signs-banners",
        permanent: true,
      },
      {
        source: "/contract-printing",
        destination: "/screen-printing",
        permanent: true,
      },
      {
        source: "/screen-print-transfers",
        destination: "/dtf-transfers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
