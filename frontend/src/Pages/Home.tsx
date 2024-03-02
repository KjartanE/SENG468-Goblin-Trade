import React from 'react'
import './App.css'
import { Typography } from '@mui/material'

function Home() {
  return (
    <div className="Home">
      <header className="App-header">
        <img
          src={
            'https://www.wargamer.com/wp-content/sites/wargamer/2022/11/dnd-goblin-5e-race-guide-goblin-face-close-up.jpg'
          }
          className="logo"
          alt="logo"
          width={1000}
        />
        <Typography variant="h3" mt={6} mb={2} gutterBottom>
          Goblin Trade
        </Typography>
        <img
          src="/gt_logo.png"
          alt="Logo"
          style={{ marginBottom: 30, width: '150px' }}
        />
      </header>
    </div>
  )
}

export default Home
