import React, { useEffect, useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'

export function ProfileForm({
  isOpen = false,
  value = {},
  onClose = () => {},
  onEdit = () => {},
  onAdd = () => {},
  onCancel = () => {},
  onDelete = () => {},
}) {
  const classes = useStyles()
  const { id, firstName, lastName, address, city, zip } = value
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const addressRef = useRef()
  const cityRef = useRef()
  const zipRef = useRef()
  const hasId = Boolean(id)

  return (
    <Dialog open={isOpen} onClose={onClose} disableBackdropClick>
      <DialogTitle>
        Profil
        <div className={classes.headerButtons}>
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
          label="Vorname"
          defaultValue={firstName}
          inputRef={firstNameRef}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Nachname"
          defaultValue={lastName}
          inputRef={lastNameRef}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          multiline
          rows={3}
          label="Adresse"
          defaultValue={address}
          inputRef={addressRef}
        />
        <div className={classes.wrapper}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Logo URL"
            defaultValue={zip}
            inputRef={zipRef}
          />
        </div>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onCancel} color="primary" autoFocus>
          Abbrechen
        </Button>
        <Button onClick={() => onAdd({})} color="primary">
          Speichern
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
}))
