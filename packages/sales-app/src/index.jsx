import '@babel/polyfill'
import 'roboto-fontface'

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import { App } from './App'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './theme'

render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <App />
    </Router>
  </ThemeProvider>,
  document.getElementById('root')
)
