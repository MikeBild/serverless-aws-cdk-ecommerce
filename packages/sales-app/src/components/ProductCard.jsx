import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid, Card, CardActions, CardContent, CardMedia } from '@material-ui/core'
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/EditOutlined'

export function ProductCard({ item = {}, onEdit = () => {}, onDelete = () => {} }) {
  const {
    id,
    title,
    description,
    price,
    logoUrl,
    color = '#FFF',
    category: { title: categoryTitle, color: categoryColor } = {},
  } = item
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)
  const actions = [
    {
      icon: <EditIcon />,
      name: 'Ändern',
      onClick: onEdit,
    },
    {
      icon: <DeleteIcon />,
      name: 'Löschen',
      onClick: onDelete,
    },
  ]

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Card className={classes.card} square={true}>
        {logoUrl && <CardMedia className={classes.cover} image={logoUrl} title={title} />}
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
        <CardContent className={classes.content} style={{ backgroundColor: color }}>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography noWrap variant="body2">
            {description}
          </Typography>
          <Typography noWrap variant="h5" component="h2">
            {price} €
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <SpeedDial
            ariaLabel="Aktionen"
            FabProps={{ size: 'small' }}
            icon={<EditIcon />}
            open={isOpen}
            onClick={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            direction="left"
          >
            {actions.map(({ name, icon, onClick }) => (
              <SpeedDialAction key={name} icon={icon} tooltipTitle={name} onClick={onClick} />
            ))}
          </SpeedDial>
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
