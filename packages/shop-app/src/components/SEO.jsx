import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql, withPrefix } from 'gatsby'

export function SEO({ description, lang = 'de', meta = [], keywords = [], title }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )
  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        { name: 'msapplication-TileColor', content: '#da532c' },
        { name: 'theme-color', content: '#ffffff' },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : []
        )
        .concat(meta)}
    >
      <link rel="apple-touch-icon" sizes="180x180" href={withPrefix('/favicons/apple-touch-icon.png')} />
      <link rel="icon" type="image/png" sizes="32x32" href={withPrefix('/favicons/favicon-32x32.png')} />
      <link rel="icon" type="image/png" sizes="16x16" href={withPrefix('/favicons/favicon-16x16.png')} />
    </Helmet>
  )
}
