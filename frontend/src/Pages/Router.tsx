import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import User from './User'
import StockDetails from './StockDetails'
import PlaceOrder from './PlaceOrder'
import Wallet from './Wallet'
import Register from './Register'

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user" element={<User />} />
      <Route path="/stock-details" element={<StockDetails />} />
      <Route path="/place-order" element={<PlaceOrder />} />
      <Route path="/my-wallet" element={<Wallet />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default Router
