import React, { useContext, useRef, useState } from 'react'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { AppContext } from '@serverless-aws-cdk-ecommerce/react-components'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Typography, Container } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

export function ConfirmPage() {
  const history = useHistory()
  const classes = useStyles()
  const { Auth } = useContext(AppContext)
  const [message, setMessage] = useState('')
  const emailRef = useRef('')
  const codeRef = useRef('')

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await Auth.confirmSignUp(emailRef.current.value, codeRef.current.value)
      history.push('/signin')
    } catch (error) {
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
          Benutzerregistrierung bestätigen
        </Typography>

        <Grid item xs={12} className={classes.subtitle}>
          <Typography variant="body2" gutterBottom>
            Bitte geben Sie den Registrierungscode aus Ihrer E-Mail ein.
          </Typography>
        </Grid>

        <form className={classes.form} noValidate onSubmit={e => handleSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="EMail Adresse"
                name="email"
                autoComplete="email"
                inputRef={emailRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="confirm"
                label="Code"
                name="confirm"
                autoComplete="confirm"
                inputRef={codeRef}
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
