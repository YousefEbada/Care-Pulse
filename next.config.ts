import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // تجاهل ESLint Errors في عملية الـ build
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* باقي الإعدادات لو موجودة */
};

export default withSentryConfig(nextConfig, {
  org: "js-mastery-xb",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
