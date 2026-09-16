import type { MetadataRoute } from 'next';




export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'http://localhost:3000',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: 'http://localhost:3000/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'http://localhost:3000/register',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
  ];
}
