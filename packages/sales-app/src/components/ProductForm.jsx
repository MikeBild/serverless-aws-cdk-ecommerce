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
  const {
    id,
    title,
    subtitle,
    isInactive = false,
    inactiveReason = '...',
    description,
    logoUrl,
    videoUrl,
    category: { id: categoryId } = {},
  } = value
  const titleRef = useRef()
  const subtitleRef = useRef()
  const descriptionRef = useRef()
  const logoUrlRef = useRef()
  const videoUrlRef = useRef()
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
          fullWidth
          label="Untertitel"
          defaultValue={subtitle}
          inputRef={subtitleRef}
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
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Video URL"
          defaultValue={videoUrl}
          inputRef={videoUrlRef}
        />
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
                inactiveReason,
                isInactive,
                categoryId: newCategoryId,
                description: descriptionRef.current.value,
                logoUrl: logoUrlRef.current.value,
                subtitle: subtitleRef.current.value,
                title: titleRef.current.value,
                videoUrl: videoUrlRef.current.value,
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
                inactiveReason,
                isInactive,
                categoryId: newCategoryId,
                description: descriptionRef.current.value,
                logoUrl: logoUrlRef.current.value,
                subtitle: subtitleRef.current.value,
                title: titleRef.current.value,
                videoUrl: videoUrlRef.current.value,
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
