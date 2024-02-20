import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import User from './User'
import StockPrices from './StockPrices'
import StockTransactions from './StockTransactions'

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user" element={<User />} />
      <Route path="/stock-prices" element={<StockPrices />} />
      <Route path="/stock-transactions" element={<StockTransactions />} />
    </Routes>
  )
}

export default Router
