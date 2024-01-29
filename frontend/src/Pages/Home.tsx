import React from 'react'
import './App.css'
import Button from '@mui/material/Button'

function Home() {
  return (
    <div className="Home">
      <header className="App-header">
        <img
          src={
            'https://www.wargamer.com/wp-content/sites/wargamer/2022/11/dnd-goblin-5e-race-guide-goblin-face-close-up.jpg'
          }
          className="App-logo"
          alt="logo"
        />
        <p>GOBLIN TRADE</p>
        <Button variant="contained" href="./login">
          SIGN IN
        </Button>
      </header>
    </div>
  )
}

export default Home
