import React, { useContext, useRef, useState } from 'react'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { AppContext } from '@serverless-aws-cdk-ecommerce/react-components'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

export function PasswordPage() {
  const history = useHistory()
  const classes = useStyles()
  const { Auth, user } = useContext(AppContext)
  const [message, setMessage] = useState('')
  const newPasswordRef = useRef('')
  const newPasswordVerifyRef = useRef('')

  const handleSubmit = async e => {
    e.preventDefault()

    if (newPasswordRef.current.value !== newPasswordVerifyRef.current.value) {
      return setMessage('Kennwörter stimmen nicht überein.')
    }

    try {
      await Auth.completeNewPassword(user, newPasswordRef.current.value)
      history.push('/signin')
    } catch (error) {
      console.error(error)
      setMessage(error.message)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Kennwort ändern
        </Typography>

        <Grid item xs={12} className={classes.subtitle}>
          <Typography variant="body2" gutterBottom>
            Bitte geben Sie Ihr altes und neues Kennwort ein.
          </Typography>
        </Grid>

        <form className={classes.form} noValidate onSubmit={e => handleSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                type="password"
                required
                fullWidth
                id="newpassword"
                label="Neues Kennwort"
                name="newpassword"
                inputRef={newPasswordRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                type="password"
                required
                fullWidth
                id="newpasswordverify"
                label="Kennwort verifizieren"
                name="newpasswordverify"
                inputRef={newPasswordVerifyRef}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                Bestätigen
              </Button>
            </Grid>
          </Grid>
        </form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {message && <p style={{ color: 'red' }}>{message}</p>}
          </Grid>
        </Grid>
      </div>
    </Container>
  )
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  subtitle: {
    marginTop: theme.spacing(2),
  },
}))
