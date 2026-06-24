import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rescuemind-ai.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/report", "/privacy", "/terms"],
        disallow: ["/dashboard", "/auth", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
