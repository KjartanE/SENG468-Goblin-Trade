import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import User from './User'
import StockDetails from './StockDetails'

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user" element={<User />} />
      <Route path="/stock-details" element={<StockDetails />} />
    </Routes>
  )
}

export default Router
