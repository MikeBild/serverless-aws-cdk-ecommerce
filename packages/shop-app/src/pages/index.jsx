import React, { useContext, useEffect, useState } from 'react'
import { Link as RouterLink, navigate } from 'gatsby'
import { useQuery, useMutation } from '@apollo/react-hooks'
import graphql from 'graphql-tag'
import { makeStyles } from '@material-ui/core/styles'
import { Layout, Loading, SearchInput, AppContext } from '@serverless-aws-cdk-ecommerce/react-components'
import { Container, Grid, IconButton, Badge, MenuItem } from '@material-ui/core'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import SettingsIcon from '@material-ui/icons/Settings'
import { ProductCard } from '../components/ProductCard'
import { CartSummary } from '../components/CartSummary'
import { ProfileForm } from '../components/ProfileForm'
import { SEO } from '../components/SEO'

const PAGE_QUERY = graphql(`
  query ProductPage($id: ID = "undefined") {
    productList {
      products: items {
        id
        title
        price
        description
        logoUrl
      }
    }
    cart: cartGet(id: $id) {
      id
      products {
        id
        title
        description
        price
        logoUrl
      }
    }
  }
`)

const CART_UPSERT = graphql(`
  mutation CartUpsert($input: CartUpsertInput!) {
    cartUpsert(input: $input) {
      id
      products {
        id
        title
        description
        price
        logoUrl
      }
    }
  }
`)

export default function Products() {
  const classes = useStyles()
  const { loading, data: { cart, productList: { products = [] } = {} } = {} } = useQuery(PAGE_QUERY, {
    variables: { id: 'cart1' },
    pollInterval: 10000,
  })
  const [cartUpsert] = useMutation(CART_UPSERT)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { products: cartProducts = [] } = cart || {}

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
              <IconButton className={classes.shoppingCartLink} onClick={() => setIsCartOpen(true)}>
                <Badge badgeContent={cartProducts.filter(Boolean).length} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </>
          )
        }}
        renderProfileMenu={({ close }) => {
          return (
            <MenuItem
              onClick={() => {
                setIsProfileOpen(true)
                close()
              }}
            >
              <SettingsIcon className={classes.leftIcon} />
              Profil
            </MenuItem>
          )
        }}
        onLogout={() => navigate('/signin')}
      >
        <Loading isLoading={loading} />
        <ProfileForm
          isOpen={isProfileOpen}
          onCancel={() => setIsProfileOpen(false)}
          onClose={() => setIsProfileOpen(false)}
        />
        <CartSummary
          value={cart || {}}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCancel={() => setIsCartOpen(false)}
          onCartOrder={() => {}}
          onRemoveProduct={async ({ id }) => {
            const productIds = cartProducts
              .filter(Boolean)
              .map(({ id }) => id)
              .filter(itm => itm !== id)
            await cartUpsert({ variables: { input: { id: cart.id, productIds } } })
          }}
        />
        <Container className={classes.contentGrid} maxWidth="xl">
          <SearchInput placeholderText="Produktsuche" className={classes.search} />
          <Grid container spacing={4}>
            {products.filter(Boolean).map(item => (
              <ProductCard
                item={item}
                key={item.id}
                onAddToCart={async ({ id }) => {
                  const productIds = [...new Set([...cartProducts.filter(Boolean).map(({ id }) => id), id])]
                  await cartUpsert({ variables: { input: { id: cart.id, productIds } } })
                }}
              />
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
  leftIcon: {
    marginRight: theme.spacing(1),
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
