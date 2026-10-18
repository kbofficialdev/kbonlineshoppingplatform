import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kbfashions.in';
  const lastModified = new Date();

  const routes = [
    '',
    '/products',
    '/support',
    '/account',
    '/policies/privacy-policy',
    '/policies/terms-conditions',
    '/policies/shipping-policy',
    '/policies/cancellation-refund',
    '/policies/contact-us',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}

