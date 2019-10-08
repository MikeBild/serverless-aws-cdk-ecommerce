import React from 'react'
import { graphql } from 'gatsby'
import { Layout } from '@serverless-aws-cdk-ecommerce/react-components'
import { SEO } from '../components/SEO'

export default function ProductPageTemplate() {
  return (
    <Layout>
      <SEO title="" />
    </Layout>
  )
}

export const pageQuery = graphql`
  query ProductsQuery($id: ID!) {
    ecommerce {
      productList(filter: { id: { eq: $id } }) {
        products: items {
          ...ProductFragment
        }
      }
    }
  }
  fragment ProductFragment on ECommerce_Product {
    id
    title
  }
`
