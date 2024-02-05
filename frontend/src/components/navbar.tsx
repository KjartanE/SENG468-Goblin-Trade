import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu' // Importing the burger menu icon
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from './sidebar'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false) // State to manage Drawer

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleUserClick = () => {
    navigate('/user')
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
  }

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }
      setIsDrawerOpen(open)
    }

  const shouldShowAuthOptions =
    location.pathname !== '/login' && location.pathname !== '/register'

  return (
    <AppBar
      position="static"
      sx={{ background: '#5a189a', position: 'relative' }}
    >
      <Toolbar sx={{ position: 'relative', justifyContent: 'space-between' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, zIndex: 1 }}
          onClick={() => setIsDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Sidebar
          isOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
          isAuthenticated={!!user}
        />
        <img
          src="../../public/logo.png"
          alt="Logo"
          onClick={handleLogoClick}
          style={{
            cursor: 'pointer',
            position: 'absolute',
            width: '120px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
          }}
        />
        <div style={{ display: 'flex', zIndex: 1 }}>
          {user ? (
            <>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={handleUserClick}
              >
                {user.name}
              </Typography>
              <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
                <ArrowDropDownIcon />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            shouldShowAuthOptions && (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  href="/login"
                  sx={{ marginLeft: 1, color: '#fff', borderColor: '#fff' }}
                >
                  Sign in
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  href="/register"
                  sx={{ marginLeft: 1 }}
                >
                  Register
                </Button>
              </>
            )
          )}
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
