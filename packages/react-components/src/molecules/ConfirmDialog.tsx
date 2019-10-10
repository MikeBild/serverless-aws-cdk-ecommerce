import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

interface ConfirmDialogProps {
  title: string
  content: string
  isOpen: boolean
  onAgree: () => void
  onDisagree: () => void
  onClose: () => void
}

export function ConfirmDialog({
  title,
  content,
  isOpen,
  onAgree = () => {},
  onDisagree = () => {},
  onClose = () => {},
}: ConfirmDialogProps): JSX.Element {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      disableBackdropClick={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDisagree} color="primary" autoFocus>
          Abbrechen
        </Button>
        <Button onClick={onAgree} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
