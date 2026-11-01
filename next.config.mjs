/** @type {import('next').NextConfig} */
const nextConfig = {
  // Drops the "X-Powered-By: Next.js" response header - minor, but no
  // reason to hand out free framework/version fingerprinting.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Forces HTTPS for a year, including subdomains, and opts into
          // browser HSTS preload lists.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Stops the browser from guessing content types - blocks a class
          // of MIME-sniffing attacks on user-uploaded media.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Nothing on this site needs to be framed by another origin -
          // blocks clickjacking.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), payment=(), usb=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
