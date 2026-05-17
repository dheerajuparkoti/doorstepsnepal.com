import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/dashboard/",
          "/dashboard",
          "/(auth)/",
          "/api/",
          "/notifications/",
        ],
      },
    ],
    sitemap: "https://www.doorstepsnepal.com/sitemap.xml",
  };
}
