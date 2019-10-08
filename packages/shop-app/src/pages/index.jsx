import React, { useContext, useEffect } from 'react'
import { Link as RouterLink, navigate } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import graphql from 'graphql-tag'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, IconButton } from '@material-ui/core'
import { ShoppingCart as ShoppingCartIcon } from '@material-ui/icons'
import { Layout, Loading, SearchInput, AppContext } from '@serverless-aws-cdk-ecommerce/react-components'
import { ProductCard } from '../components/ProductCard'
import { SEO } from '../components/SEO'

const LIST = graphql(`
  query ProductList {
    productList {
      products: items {
        id
        title
      }
    }
  }
`)

export default function Products() {
  const classes = useStyles()
  const { loading, data: { productList: { products = [] } = {} } = {} } = useQuery(LIST)

  return (
    <CheckAuth isProtected={false}>
      <SEO title="E-Commerce Shop" />
      <Layout
        title="E-Commerce Shop"
        LinkComponent={RouterLink}
        renderTopMenu={() => {
          return (
            <>
              <RouterLink to="/" className={classes.topMenuLink}>
                Produkte
              </RouterLink>
              <IconButton className={classes.shoppingCartLink}>
                <ShoppingCartIcon />
              </IconButton>
            </>
          )
        }}
        onLogout={() => navigate('/signin')}
      >
        <Loading isLoading={loading} />
        <Container className={classes.contentGrid} maxWidth="xl">
          <SearchInput placeholderText="Produktsuche" className={classes.search} />
          <Grid container spacing={4}>
            {products.map(item => (
              <ProductCard item={item} key={item.id} />
            ))}
          </Grid>
        </Container>
      </Layout>
    </CheckAuth>
  )
}

const useStyles = makeStyles(theme => ({
  contentGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  search: {
    paddingBottom: theme.spacing(4),
  },
  topMenuLink: {
    color: 'white',
    textDecoration: 'none',
    textTransform: 'uppercase',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    '&:hover': { color: 'lightgray', textDecoration: 'none' },
  },
  shoppingCartLink: {
    color: 'white',
    textDecoration: 'none',
  },
}))

function CheckAuth({ children, isProtected = false }) {
  const hasToken = Boolean(localStorage.getItem('token'))
  const { user = hasToken ? {} : undefined, setUser, Auth } = useContext(AppContext)
  const fetchCurrentAuthenticatedUser = async () => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser()
      localStorage.setItem('token', cognitoUser.signInUserSession.accessToken.jwtToken)
      setUser(cognitoUser)
    } catch (error) {
      localStorage.removeItem('token')
      setUser(undefined)
      navigate('/signin')
    }
  }

  useEffect(() => {
    fetchCurrentAuthenticatedUser()
  }, [])

  if (isProtected && !user) {
    return null
  }

  return children
}
