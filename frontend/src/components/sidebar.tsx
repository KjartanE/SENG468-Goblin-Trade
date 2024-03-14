import React from 'react'
import { Drawer, List, ListItem, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void
  isAuthenticated: boolean
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleDrawer,
  isAuthenticated,
  setIsDrawerOpen,
}) => {
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsDrawerOpen(false); 
  };

  return (
    <Drawer anchor={'left'} open={isOpen} onClose={toggleDrawer(false)}>
      <List>
        {isAuthenticated ? (
          // Authenticated options
          <>
            <ListItem button onClick={() => handleNavigation('/')}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/user')}>
              <ListItemText primary="Profile" />
            </ListItem>
          </>
        ) : (
          // Not authenticated options
          <>
            <ListItem button onClick={() => handleNavigation('/Login')}>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/register')}>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  )
}

export default Sidebar
