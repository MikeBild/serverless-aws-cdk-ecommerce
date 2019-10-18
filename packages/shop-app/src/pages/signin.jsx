import React, { useContext, useRef, useState } from 'react'
import { Link as RouterLink, navigate } from 'gatsby'
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { AppContext, LoadingButton } from '@serverless-aws-cdk-ecommerce/react-components'

export default function SignIn() {
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
      if (challengeName === 'NEW_PASSWORD_REQUIRED') return navigate('/password')

      localStorage.setItem('token', signInUserSession.accessToken.jwtToken)
      navigate('/')
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      setMessage(error.message)
      localStorage.removeItem('token')
    }

    return null
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
            label="EMail Adresse"
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
          <LoadingButton type="submit" label="Anmelden" isLoading={isLoading} testId="login-button" />
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Kennwort vergessen?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" component={RouterLink} variant="body2">
                Neues Konto?
              </Link>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.message} data-testId="error-message">{message}</div>
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
