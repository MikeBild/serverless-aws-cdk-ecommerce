import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  CardMedia,
  Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'

export function CartForm({
  isOpen = false,
  value = {},
  onClose = () => {},
  onCartOrder = () => {},
  onCancel = () => {},
  onRemoveProduct = () => {},
}) {
  const classes = useStyles()
  const { id, products = [] } = value || {}
  const hasProducts = products.length
  const hasId = Boolean(id)

  return (
    <Dialog open={isOpen} onClose={onClose} disableBackdropClick>
      <DialogTitle>
        Warenkorb
        <div className={classes.headerButtons}>
          <IconButton onClick={onClose}>
            <CloseIcon color="action" />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        {!hasProducts && (
          <Typography noWrap variant="body1">
            Keine Produkte im Warenkorb
          </Typography>
        )}
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell colSpan={4}> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.filter(Boolean).map(({ id, title, logoUrl, price }) => (
              <TableRow key={id}>
                <TableCell>
                  <CardMedia className={classes.cover} image={logoUrl} title={title} />
                </TableCell>
                <TableCell align="right">{title}</TableCell>
                <TableCell align="right">{price} €</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      onRemoveProduct({ id })
                    }}
                  >
                    <DeleteIcon color="action" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onCancel} color="primary" autoFocus>
          Später
        </Button>
        <Button onClick={() => onCartOrder(value)} color="primary">
          Bestellen
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    float: 'right',
  },
  dialogActions: {
    padding: theme.spacing(3),
  },
  cover: {
    width: 100,
    height: 100,
  },
  table: {
    marginBottom: 40,
  },
}))
