import React from 'react'
import { Box, Typography, Link } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub' // Import GitHub icon

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: 'grey',
        color: 'white',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        height: '30px',
      }}
    >
      <Link
        href="https://github.com/KjartanE/SENG468-Goblin-Trade"
        color="inherit"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ marginRight: 'auto' }}
      >
        <GitHubIcon />
      </Link>

      {/* Spacer Box  to center the title */}
      <Box sx={{ flexGrow: 1 }} />

      <Typography
        variant="h6"
        component="div"
        sx={{ position: 'absolute', width: '100%', textAlign: 'center' }}
      >
        SENG 468: Goblin Trade
      </Typography>

      {/* Spacer Box  to center the title */}
      <Box sx={{ flexGrow: 1 }} />

      <Typography variant="body1" component="div" sx={{ marginLeft: 'auto' }}>
        {' '}
        Team members: Pooper, Goober, PussPuss, YumYum, Stephen Hawking
      </Typography>
    </Box>
  )
}

export default Footer
