import React, { useContext, useRef, useState } from 'react'
import { Link as RouterLink, navigate } from 'gatsby'
import { AppContext } from '@serverless-aws-cdk-ecommerce/react-components'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'

import Typography from '@material-ui/core/Typography'

import Container from '@material-ui/core/Container'

import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

export default function SignUp() {
  const classes = useStyles()
  const { Auth } = useContext(AppContext)
  const [message, setMessage] = useState('')
  const emailRef = useRef('')
  const passwordRef = useRef('')

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await Auth.signUp({
        username: emailRef.current.value,
        password: passwordRef.current.value,
        attributes: {
          email: emailRef.current.value,
          website: emailRef.current.value.split('@')[1],
        },
      })

      navigate('/confirm')
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
                name="password"
                label="Kennwort"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={passwordRef}
              />
            </Grid>
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
