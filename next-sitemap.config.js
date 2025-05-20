/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://pato.taphoaictu.id.vn',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  sitemapSize: 5000,
  outDir: './public',
  exclude: ['/admin/*'],
}
