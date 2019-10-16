import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Layout } from '@serverless-aws-cdk-ecommerce/react-components'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid, Container, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core'

import AppsIcon from '@material-ui/icons/Apps'
import EventAvailableIcon from '@material-ui/icons/EventAvailable'

export function DashboardPage() {
  const classes = useStyles()
  const history = useHistory()

  return (
    <Layout
      title="E-Commerce Sales"
      renderSideMenu={() => {
        return (
          <>
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText primary="Übersicht" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/products">
              <ListItemIcon>
                <EventAvailableIcon />
              </ListItemIcon>
              <ListItemText primary="Produkte" />
            </ListItem>
          </>
        )
      }}
      onLogout={() => history.push('/signin')}
    >
      <Container className={classes.contentGrid} maxWidth="xl">
        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.headLine}>
          Deine Übersicht
        </Typography>
        <Grid container spacing={4}></Grid>
      </Container>
    </Layout>
  )
}

const useStyles = makeStyles(theme => ({
  contentGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  headLine: {
    paddingBottom: theme.spacing(4),
  },
}))
