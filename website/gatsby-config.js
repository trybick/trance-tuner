module.exports = {
  siteMetadata: {
    title: `Trance Tuner`,
    description: `Desktop application that plays your favorite trance stations for macOS, Windows, & Linux`,
    author: `@trybick`,
    siteUrl: `https://trancetuner.netlify.app/`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown`,
        path: `${__dirname}/src/markdown/`,
      },
    },
    `gatsby-transformer-remark`,
  ],
};
