import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, CircularProgress } from '@material-ui/core'
import LoopIcon from '@material-ui/icons/Loop'

interface LoadingButtonProps {
  type?: 'submit' | 'reset' | 'button'
  label?: string
  testId?: string
  isLoading?: boolean
  isReload?: boolean
  onClick?: () => void
}

export function LoadingButton({
  type = 'button',
  label,
  isLoading,
  isReload,
  onClick = () => {},
  testId,
}: LoadingButtonProps) {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <Button
        type={type}
        fullWidth
        variant="contained"
        color="primary"
        disabled={isLoading}
        className={classes.submit}
        onClick={onClick}
        data-testid={testId}
      >
        {isReload ? (
          <>
            <LoopIcon className={classes.iconSmall} /> <span>{label}</span>
          </>
        ) : (
          <span>{label}</span>
        )}
      </Button>
      {isLoading && <CircularProgress size={24} className={classes.submitProgress} />}
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  wrapper: {
    position: 'relative',
  },
  submitProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -8,
    marginLeft: -12,
  },
  iconSmall: {
    fontSize: 20,
  },
}))
