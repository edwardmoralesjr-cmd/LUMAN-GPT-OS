import type { MetadataRoute } from 'next';
import { NAV, SITE } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return NAV.map((item) => ({
    url: `${SITE.url}${item.href}`,
    lastModified: new Date(),
    changeFrequency: item.href === '/' ? 'weekly' : 'monthly',
    priority: item.href === '/' ? 1 : 0.7,
  }));
}
