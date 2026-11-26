import { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";
import { getAllArticles } from "@/lib/articleStorage";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.brand.domain;
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/lap-mang-fpt`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wifi-6`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/combo-ngoai-hang-anh`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/truyen-hinh-fpt`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/camera-fpt`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/bang-gia`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/khuyen-mai`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quy-trinh-lap-dat`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/hoi-dap`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chinh-sach-bao-mat`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/dieu-khoan`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  try {
    const articles = getAllArticles(false);
    const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
      url: `${baseUrl}/tin-tuc/${a.slug}`,
      lastModified: new Date(a.updatedAt || a.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...articleRoutes];
  } catch {
    return staticRoutes;
  }
}
