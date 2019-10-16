import React, { useContext, useRef, useState } from 'react'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { AppContext } from '@serverless-aws-cdk-ecommerce/react-components'

import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Typography, Container } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

export function SignUpPage() {
  const history = useHistory()
  const classes = useStyles()
  const { Auth } = useContext(AppContext)
  const [message, setMessage] = useState('')
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const passwordVerifyRef = useRef('')
  const codeRef = useRef('')

  const handleSignupSubmit = async e => {
    e.preventDefault()

    if (passwordRef.current.value !== passwordVerifyRef.current.value) {
      return setMessage('Die Kennwörter stimmen nicht überein.')
    }

    try {
      await Auth.signUp({
        username: emailRef.current.value,
        password: passwordRef.current.value,
        attributes: {
          email: emailRef.current.value,
          website: emailRef.current.value.split('@')[1],
        },
      })

      setIsConfirmVisible(true)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleSignupConfigSubmit = async e => {
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
          Benutzerregistrierung
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={e => (isConfirmVisible ? handleSignupConfigSubmit(e) : handleSignupSubmit(e))}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="E-Mail"
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
                name="password"
                label="Kennwort"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={passwordRef}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                type="password"
                required
                fullWidth
                id="passwordVerifyRef"
                label="Kennwort"
                name="passwordVerifyRef"
                inputRef={passwordVerifyRef}
              />
            </Grid>

            {isConfirmVisible && (
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
            )}
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Registrieren
          </Button>
        </form>
        <Grid container justify="flex-end">
          <Grid item>
            <Link to="/signin" component={RouterLink} variant="body2">
              Zur Anmeldung
            </Link>
          </Grid>
        </Grid>
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
}))
