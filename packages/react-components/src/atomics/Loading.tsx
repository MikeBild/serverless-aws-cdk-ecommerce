import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { LinearProgress } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  skeleton: {
    height: 4,
    width: '100%',
  },
})

export function Loading({ isLoading = false }) {
  const classes = useStyles()
  if (!isLoading) return <div className={classes.skeleton}> </div>

  return (
    <div className={classes.root}>
      <LinearProgress variant="query" />
    </div>
  )
}
