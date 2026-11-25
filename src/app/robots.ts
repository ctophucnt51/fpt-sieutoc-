import { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.brand.domain;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cam-on", "/admin"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
