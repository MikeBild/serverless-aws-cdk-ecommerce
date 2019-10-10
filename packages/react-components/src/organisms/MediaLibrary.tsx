import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Container from '@material-ui/core/Container'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import ListSubheader from '@material-ui/core/ListSubheader'

import DoneIcon from '@material-ui/icons/Done'

const tileData = [
  {
    id: '1',
    title: 'Image',
    author: 'author',
    url: 'https://source.unsplash.com/random/1',
  },
  {
    id: '2',
    title: 'Image',
    author: 'author',
    url: 'https://source.unsplash.com/random/2',
  },
  {
    id: '3',
    title: 'Image',
    author: 'author',
    url: 'https://source.unsplash.com/random/3',
  },
  {
    id: '4',
    title: 'Image',
    author: 'author',
    url: 'https://source.unsplash.com/random/4',
  },
]

export function MediaLibrary({ isOpen = false, onClose = () => {}, onSelect = () => {} }) {
  const classes = useStyles()

  return (
    <Dialog fullScreen open={isOpen} onClose={() => onClose()}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Fotoalbum
          </Typography>
          <IconButton edge="end" color="inherit" onClick={() => onClose()} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container className={classes.contentGrid} maxWidth="xl">
        <TitlebarGridList onSelect={onSelect} />
      </Container>
    </Dialog>
  )
}

export function TitlebarGridList({ onSelect = (_: any) => {} }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList} cols={8}>
        <GridListTile key="Subheader" cols={8} style={{ height: 'auto' }}>
          <ListSubheader component="div">Fotos von ...</ListSubheader>
        </GridListTile>
        {tileData.map(tile => (
          <GridListTile key={tile.id} cols={1}>
            <img src={tile.url} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              subtitle={<span> </span>}
              actionIcon={
                <IconButton
                  aria-label={`info about ${tile.title}`}
                  className={classes.icon}
                  onClick={() => onSelect(tile)}
                >
                  <DoneIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  contentGrid: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {},
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}))
