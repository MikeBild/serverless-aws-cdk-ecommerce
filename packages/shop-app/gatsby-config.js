const fetch = require('isomorphic-fetch')
const { createHttpLink } = require('apollo-link-http')

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: 'E-Commerce Shop',
    author: 'Mike Bild',
    description: 'A another e-commerce shop.',
    siteUrl: 'https://ecommerce-shop.mikebild.com',
  },
  pathPrefix: '',

  plugins: [
    {
      resolve: 'gatsby-plugin-env-variables',
      options: {
        whitelist: [
          'CDK_AWS_COGNITO_USER_POOL_ID',
          'CDK_AWS_COGNITO_USER_POOL_WEBCLIENT_ID',
          'CDK_AWS_APPSYNC_URL',
          'CDK_AWS_APPSYNC_APIKEY',
          'npm_package_version',
          'CDK_STACK_ENV',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|cache|public)/,
        options: {
          emitWarning: true,
          failOnError: false,
        },
      },
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'ECommerce',
        fieldName: 'ecommerce',
        fetch,
        createLink: pluginOptions => {
          return createHttpLink({
            uri: process.env.CDK_AWS_APPSYNC_URL,
            headers: {
              'x-api-key': process.env.CDK_AWS_APPSYNC_APIKEY,
            },
          })
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'img',
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'E-Commerce Shop App',
        short_name: 'E-Commerce Shop App',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        display: 'minimal-ui',
        icons: [
          {
            src: `/favicons/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
  ],
}
