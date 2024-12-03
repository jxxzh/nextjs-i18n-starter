/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // REQUIRED: add your own domain name here (e.g. https://shipfa.st),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  changefreq: 'daily',
  // use this to exclude routes from the sitemap (i.e. a user dashboard). By default, NextJS app router metadata files are excluded (https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
  exclude: [],
  robotsTxtOptions: {
    additionalSitemaps: [
      // 详解：https://github.com/iamvishnusankar/next-sitemap#generating-dynamicserver-side-sitemaps
      `${process.env.NEXT_PUBLIC_SITE_URL}/server-sitemap.xml`, // <==== Add here
    ],
  },
  transform: async (config, path) => {
    path = path.replace('/en', '') // 移除默认语言的路由片段
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.lastmod ?? new Date().toISOString(),
    }
  },
}
