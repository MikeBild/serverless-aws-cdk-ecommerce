import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../providers/AppProvider'
import { useApolloClient } from '@apollo/react-hooks'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { Chip, Avatar, Tooltip } from '@material-ui/core'
import {
  EventAvailable as EventAvailableIcon,
  ExitToApp as ExitToAppIcon,
  PersonAdd as PersonAddIcon,
} from '@material-ui/icons'

import Drawer from '@material-ui/core/Drawer'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import FaceIcon from '@material-ui/icons/Face'
import LockIcon from '@material-ui/icons/Lock'
import SettingsIcon from '@material-ui/icons/Settings'

const drawerWidth = 240

interface LayoutProps {
  title?: string
  children: JSX.Element[] | JSX.Element
  renderSideMenu?: () => JSX.Element | null
  renderTopMenu?: () => JSX.Element | null
  onLogout?: () => void
  LinkComponent?: any
}

export function Layout({
  title = 'Empty',
  children,
  renderSideMenu,
  renderTopMenu = () => null,
  onLogout = () => null,
  LinkComponent,
}: LayoutProps): JSX.Element {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  const { user, setUser, Auth } = useContext(AppContext)
  const client = useApolloClient()
  const [anchorEl, setAnchorEl] = useState()
  const isTopMenuOpen = Boolean(anchorEl)
  const currentUsername = user && user.getUsername()
  const hasCurrentUsername = Boolean(currentUsername)
  const hasSideMenu = Boolean(renderSideMenu)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(matches && hasCurrentUsername && hasSideMenu)

  useEffect(() => {
    setIsSideMenuOpen(matches && hasCurrentUsername && hasSideMenu)
  }, [matches, hasCurrentUsername, hasSideMenu])

  return (
    <div className={classes.root}>
      <Box boxShadow={0}>
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, isSideMenuOpen && classes.appBarShift)}
          elevation={0}
        >
          <Toolbar className={classes.toolbar}>
            {hasSideMenu && hasCurrentUsername && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
                className={clsx(classes.menuButton, isSideMenuOpen && classes.menuButtonHidden)}
              >
                <MenuIcon />
              </IconButton>
            )}
            {!hasSideMenu && (
              <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                {title}
              </Typography>
            )}
            {hasCurrentUsername && <div className={classes.title}> </div>}
            {renderTopMenu()}
            <MenuItem button={false}>
              <Chip
                avatar={
                  <Avatar className={classes.beta}>
                    <FaceIcon />
                  </Avatar>
                }
                label="BETA"
                className={classes.chip}
              />
            </MenuItem>
            {hasCurrentUsername && (
              <>
                <IconButton color="inherit">
                  <Badge badgeContent={0} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="Konto des Benutzers"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  onClick={event => setAnchorEl(event.currentTarget)}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  id="primary-search-account-menu"
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={isTopMenuOpen}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{ square: true }}
                >
                  <MenuItem disabled>{currentUsername}</MenuItem>
                  <Divider />
                  <MenuItem component={LinkComponent} to="/profile" onClick={() => setAnchorEl(null)}>
                    <SettingsIcon className={classes.leftIcon} />
                    Profil
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={async () => {
                      await Auth.signOut({ global: true })
                      await client.resetStore()
                      localStorage.removeItem('token')
                      setUser()
                      onLogout()
                    }}
                  >
                    <LockIcon className={classes.leftIcon} />
                    Abmelden
                  </MenuItem>
                </Menu>
              </>
            )}
            {!hasCurrentUsername && (
              <>
                <Tooltip title="Anmelden">
                  <IconButton color="inherit" component={LinkComponent} to="/signin">
                    <Badge badgeContent={0} color="secondary">
                      <ExitToAppIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Registrieren">
                  <IconButton color="inherit" component={LinkComponent} to="/signup">
                    <Badge badgeContent={0} color="secondary">
                      <PersonAddIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      {hasSideMenu && hasCurrentUsername && (
        <Drawer
          variant="permanent"
          classes={{ paper: clsx(classes.drawerPaper, !isSideMenuOpen && classes.drawerPaperClose) }}
          open={isSideMenuOpen}
        >
          <div className={classes.toolbarIcon}>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              {title}
            </Typography>
            <IconButton onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List className={classes.sideBarList}>{renderSideMenu && renderSideMenu()}</List>
        </Drawer>
      )}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {children}
      </main>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
  },
  sideBarList: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  chip: {
    backgroundColor: 'red',
    color: 'white',
  },
  beta: {
    backgroundColor: 'red',
    color: 'white',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}))
