const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const productPageTemplate = path.resolve('src/templates/ProductPage.jsx')
  const result = await graphql(`
    query ProductList {
      ecommerce {
        productList {
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
  `)

  if (result.errors) return console.error(result.errors)

  result.data.ecommerce.productList.products.forEach(({ id }) => {
    createPage({
      path: `/products/${id}/`,
      component: productPageTemplate,
      context: {
        id,
      },
    })
  })
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: { fs: 'empty' },
  })
}
