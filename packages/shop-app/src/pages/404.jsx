import React from 'react'
import { Link as RouterLink, navigate } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Typography, IconButton } from '@material-ui/core'
import { ShoppingCart as ShoppingCartIcon } from '@material-ui/icons'
import { Layout } from '@serverless-aws-cdk-ecommerce/react-components'

export default function Profile() {
  const classes = useStyles()

  return (
    <Layout
      title="404"
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
      <Container className={classes.contentGrid} maxWidth="xl">
        <Typography component="h1" variant="h6" color="inherit" noWrap>
          404
        </Typography>
        <Grid container spacing={4} />
      </Container>
    </Layout>
  )
}

const useStyles = makeStyles(theme => ({
  contentGrid: {
    paddingTop: theme.spacing(4),
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
