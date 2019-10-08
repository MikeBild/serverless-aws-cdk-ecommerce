import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemText, ListItemIcon, Container, Grid, Divider } from '@material-ui/core'
import { Refresh as RefreshIcon, EventAvailable as EventAvailableIcon, Apps as AppsIcon } from '@material-ui/icons'
import {
  Layout,
  Loading,
  AppContext,
  MediaLibrary,
  ConfirmDialog,
  Topbar,
  SearchInput,
} from '@serverless-aws-cdk-ecommerce/react-components'
import { ProductForm } from '../components/ProductForm'
import { ProductCard } from '../components/ProductCard'
import LIST from '../graphql/product-list.graphql'
import DELETE from '../graphql/product-mutation-delete.graphql'
import UPSERT from '../graphql/product-mutation-upsert.graphql'

export function ProductPage() {
  const classes = useStyles()
  const history = useHistory()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selected, setSelected] = useState({})

  const { loading, refetch, data: { productList: { products = [] } = {} } = {} } = useQuery(LIST)
  const [deleteEntity, {}] = useMutation(DELETE)
  const [upsertEntity, {}] = useMutation(UPSERT)

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
            <Divider />
            <ListItem button onClick={() => refetch()}>
              <ListItemIcon>
                <RefreshIcon />
              </ListItemIcon>
              <ListItemText primary="Aktualisieren" />
            </ListItem>
          </>
        )
      }}
      onLogout={() => history.push('/signin')}
    >
      <Loading isLoading={loading} />
      <ConfirmDialog
        title="Achtung"
        content="Wollen Sie wirklich löschen?"
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onAgree={async () => {
          await deleteEntity({ variables: { id: selected.id } })
          await refetch()
          setIsConfirmDialogOpen(false)
          setIsFormOpen(false)
          setSelected({})
        }}
        onDisagree={() => setIsConfirmDialogOpen(false)}
      />
      <ProductForm
        value={selected}
        isOpen={isFormOpen}
        onClose={() => {
          setSelected({})
          setIsFormOpen(false)
        }}
        onCancel={() => {
          setSelected({})
          setIsFormOpen(false)
        }}
        onAddPhoto={() => setIsMediaLibraryOpen(true)}
        onEdit={async input => {
          await upsertEntity({ variables: { input } })
          setIsFormOpen(false)
          setSelected({})
        }}
        onAdd={async input => {
          await upsertEntity({ variables: { input } })
          await refetch()
          setIsFormOpen(false)
          setSelected({})
        }}
        onDelete={input => {
          setSelected(input)
          setIsConfirmDialogOpen(true)
        }}
      />
      <MediaLibrary
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelect={image => {
          setIsMediaLibraryOpen(false)
          setSelected({
            ...selected,
            logoUrl: image.url,
          })
        }}
      />
      <Container className={classes.contentGrid} maxWidth="xl">
        <Topbar
          renderSearchInput={() => <SearchInput placeholderText="Produktsuche" />}
          onAddClick={() => {
            setSelected({})
            setIsFormOpen(true)
          }}
        />
        <Grid container spacing={4}>
          {products.map(item => (
            <ProductCard
              item={item}
              key={item.id}
              onEdit={() => {
                setSelected(item)
                setIsFormOpen(true)
              }}
              onDelete={() => {
                setSelected(item)
                setIsConfirmDialogOpen(true)
              }}
            />
          ))}
        </Grid>
      </Container>
    </Layout>
  )
}

const useStyles = makeStyles(theme => ({
  contentGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}))
