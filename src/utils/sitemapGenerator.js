// C:\xampp\htdocs\FrontComputerChip\src\utils\sitemapGenerator.js
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { getProductUrl } from './slugUtils';

export const generateSitemap = () => {
  const baseUrl = 'https://tudominio.com';
  const urls = SAMPLE_PRODUCTS.map(product => ({
    url: `${baseUrl}${getProductUrl(product)}`,
    lastmod: product.updatedAt || product.createdAt,
    changefreq: 'weekly',
    priority: 0.8
  }));
  
  // Generar XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  urls.forEach(({ url, lastmod, changefreq, priority }) => {
    xml += '  <url>\n';
    xml += `    <loc>${url}</loc>\n`;
    if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
};