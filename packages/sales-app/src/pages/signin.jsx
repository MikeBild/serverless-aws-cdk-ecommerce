import React, { useContext, useRef, useState } from 'react'
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom'
import { AppContext, LoadingButton } from '@serverless-aws-cdk-ecommerce/react-components'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar, CssBaseline, TextField, Link, Grid, Typography, Container } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

export function SignInPage() {
  const history = useHistory()
  const { state: { from = '/' } = {} } = useLocation()
  const classes = useStyles()
  const { Auth, setUser } = useContext(AppContext)
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)

    try {
      const user = await Auth.signIn(emailRef.current.value, passwordRef.current.value)
      setUser(user)

      const { challengeName, signInUserSession } = user
      if (challengeName === 'NEW_PASSWORD_REQUIRED') return history.push('/password')

      localStorage.setItem('token', signInUserSession.accessToken.jwtToken)
      history.push(from)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      setMessage(error.message)
      localStorage.removeItem('token')
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
          Benutzeranmeldung
        </Typography>
        <form className={classes.form} noValidate onSubmit={e => handleSubmit(e)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-Mail"
            name="email"
            autoComplete="email"
            autoFocus
            inputRef={emailRef}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Kennwort"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={passwordRef}
          />
          <LoadingButton type="submit" label="Anmelden" isLoading={isLoading} />
          <Grid container>
            <Grid item xs>
              <Link to="/forgot" component={RouterLink} variant="body2">
                Kennwort vergessen?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" component={RouterLink} variant="body2">
                Neues Konto?
              </Link>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.message}>{message}</div>
            </Grid>
          </Grid>
        </form>
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
    marginTop: theme.spacing(1),
  },
  message: {
    color: 'red',
    margin: theme.spacing(2, 0),
  },
}))
