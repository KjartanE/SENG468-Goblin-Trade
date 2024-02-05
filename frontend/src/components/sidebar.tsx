import React from 'react'
import { Drawer, List, ListItem, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void
  isAuthenticated: boolean
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleDrawer,
  isAuthenticated,
}) => {
  const navigate = useNavigate()

  return (
    <Drawer anchor={'left'} open={isOpen} onClose={toggleDrawer(false)}>
      <List>
        {isAuthenticated ? (
          // Authenticated options
          <>
            <ListItem button onClick={() => navigate('/')}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => navigate('/user')}>
              <ListItemText primary="Profile" />
            </ListItem>
          </>
        ) : (
          // Not authenticated options
          <ListItem button onClick={() => navigate('/register')}>
            <ListItemText primary="Register" />
          </ListItem>
        )}
      </List>
    </Drawer>
  )
}

export default Sidebar
