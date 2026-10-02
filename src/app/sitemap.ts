import type { MetadataRoute } from 'next';
import { listVehicles } from '@/lib/dealership-db';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) return [];
  const vehicleRoutes = listVehicles().map((vehicle) => ({
    url: `${baseUrl}/veiculos/${vehicle.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: vehicle.featured ? 0.9 : 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/veiculos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...vehicleRoutes,
  ];
}
