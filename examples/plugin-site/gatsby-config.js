module.exports = {
  siteMetadata: {
    title: 'gatsby-source-notionso example site',
    description:
      'series of article to explain how to use the gatsby-source-notionso',
    basePath: '/',
  },
  plugins: [
    {
      resolve: 'gatsby-source-notionso',
      options: {
        name: 'Blog',
        rootPageUrl: process.env.GATSBY_NOTIONSO_ROOT_PAGE_URL,
        debug: false,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
  ],
};