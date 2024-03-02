import React from 'react'
import './App.css'

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
        <p>GOBLIN TRADE</p>
        <img
          src="/gt_logo.png"
          alt="Logo"
          style={{ margin: 50, width: '150px' }}
        />
      </header>
    </div>
  )
}

export default Home
