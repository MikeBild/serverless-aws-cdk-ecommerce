import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import AddIcon from '@material-ui/icons/Add'
import PublishIcon from '@material-ui/icons/Publish'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreIcon from '@material-ui/icons/MoreHoriz'

interface TopbarProps {
  renderSearchInput?: () => JSX.Element
  renderFilterInput?: () => JSX.Element
  onAddClick?: () => void
  onPublishClick?: () => void
  onDeleteClick?: () => void
}

export function Topbar({
  renderSearchInput = () => <div style={{ height: 40 }} />,
  renderFilterInput = () => <div style={{ height: 40 }} />,
  onAddClick,
  onPublishClick,
  onDeleteClick,
}: TopbarProps) {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Paper className={classes.paper} square={true}>
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <div style={{ flex: 'auto' }}>{renderSearchInput()}</div>
        <div style={{ flex: 'auto' }}>{renderFilterInput()}</div>
        <div style={{ flex: 'auto' }}> </div>
        <div style={{ flex: 'auto' }}> </div>
        <div style={{ flex: 'auto' }}> </div>
      </Grid>
      <Grid container direction="row" justify="flex-end" alignItems="center">
        <SpeedDial
          className={classes.speedDial}
          ariaLabel="Aktionen"
          FabProps={{ size: 'small' }}
          icon={<MoreIcon />}
          open={isOpen}
          onClick={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          direction="left"
        >
          {onDeleteClick && <SpeedDialAction icon={<DeleteIcon />} tooltipTitle="Löschen" onClick={onDeleteClick} />}
          {onPublishClick && (
            <SpeedDialAction icon={<PublishIcon />} tooltipTitle="Publizieren" onClick={onPublishClick} />
          )}
          {onAddClick && <SpeedDialAction icon={<AddIcon />} tooltipTitle="Anlegen" onClick={onAddClick} />}
        </SpeedDial>
      </Grid>
    </Paper>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginBottom: theme.spacing(4),
    position: 'sticky',
    top: '80px',
    zIndex: 1100,
    padding: theme.spacing(2),
  },
  speedDial: {
    margin: theme.spacing(2),
    position: 'absolute',
  },
}))
