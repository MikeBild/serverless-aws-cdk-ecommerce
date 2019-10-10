import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid, Card, CardActions, CardContent, CardMedia, IconButton } from '@material-ui/core'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'

export function ProductCard({ item = {}, onAddToCart }) {
  const {
    title,
    price,
    description,
    logoUrl,
    color = '#FFF',
    category: { title: categoryTitle, color: categoryColor } = {},
  } = item
  const classes = useStyles()

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Card className={classes.card} square>
        {logoUrl && <CardMedia className={classes.cover} image={logoUrl} title={title} />}
        {categoryTitle && (
          <div
            style={{
              backgroundColor: categoryColor,
              color: '#FFF',
              padding: '15px',
            }}
          >
            <Typography noWrap variant="body1">
              {categoryTitle}
            </Typography>
          </div>
        )}
        <CardContent className={classes.content} style={{ backgroundColor: color }}>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography noWrap variant="caption">
            {description}
          </Typography>
          <Typography noWrap variant="h5" component="h2">
            {price} €
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <IconButton onClick={() => onAddToCart(item)}>
            <AddShoppingCartIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  )
}

const useStyles = makeStyles(theme => ({
  card: {},
  content: {},
  cover: {
    height: 200,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(0),
  },
}))
