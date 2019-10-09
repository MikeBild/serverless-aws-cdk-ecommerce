import React, { useEffect, useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'

export function ProductForm({
  isOpen = false,
  value = {},
  onClose = () => {},
  onEdit = () => {},
  onAdd = () => {},
  onCancel = () => {},
  onAddPhoto = () => {},
  onDelete = () => {},
}) {
  const classes = useStyles()
  const { id, title, price, description, logoUrl, category: { id: categoryId } = {} } = value
  const titleRef = useRef()
  const priceRef = useRef()
  const descriptionRef = useRef()
  const logoUrlRef = useRef()
  const [newCategoryId, setNewCategoryId] = useState(categoryId)
  const hasId = Boolean(id)

  useEffect(() => {
    if (logoUrlRef && logoUrlRef.current) logoUrlRef.current.value = logoUrl
  }, [logoUrl])

  return (
    <Dialog open={isOpen} onClose={onClose} disableBackdropClick={true}>
      <DialogTitle>
        Produkt
        <div className={classes.headerButtons}>
          {hasId && (
            <IconButton onClick={() => onDelete({ ...value })}>
              <DeleteIcon color="action" />
            </IconButton>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon color="action" />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Titel"
          defaultValue={title}
          inputRef={titleRef}
        />
        <TextField
          variant="outlined"
          margin="normal"
          type="number"
          fullWidth
          label="Preis"
          defaultValue={price}
          inputRef={priceRef}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          multiline
          rows={6}
          label="Beschreibung"
          defaultValue={description}
          inputRef={descriptionRef}
        />
        <div className={classes.wrapper}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Logo URL"
            defaultValue={logoUrl}
            inputRef={logoUrlRef}
          />
          <div>
            <IconButton onClick={onAddPhoto} className={classes.addPhotoButton}>
              <AddAPhotoIcon color="action" />
            </IconButton>
          </div>
        </div>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onCancel} color="primary" autoFocus>
          Abbrechen
        </Button>
        {hasId ? (
          <Button
            onClick={() =>
              onEdit({
                id,
                title: titleRef.current.value,
                price: priceRef.current.value,
                description: descriptionRef.current.value,
                logoUrl: logoUrlRef.current.value,
                categoryId: newCategoryId,
              })
            }
            color="primary"
          >
            Ändern
          </Button>
        ) : (
          <Button
            onClick={() =>
              onAdd({
                title: titleRef.current.value,
                price: priceRef.current.value,
                description: descriptionRef.current.value,
                logoUrl: logoUrlRef.current.value,
                categoryId: newCategoryId,
              })
            }
            color="primary"
          >
            Anlegen
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  addPhotoButton: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
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
}))
