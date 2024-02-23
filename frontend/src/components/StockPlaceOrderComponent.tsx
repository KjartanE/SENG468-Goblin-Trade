import { Formik, Form, Field } from 'formik'
import { IOrderFormValues } from '../types/stocks'
import {
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from '@mui/material'
import { WidthWide } from '@mui/icons-material'

const initialValues: IOrderFormValues = {
  stock_id: '',
  is_buy: '',
  order_type: '',
  quantity: '',
  price: '',
}

function StockPlaceOrderComponent() {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        // Handle form submission here
        console.log(values)
      }}
    >
      {({ values, handleChange }) => (
        <Form>
          <FormControl sx={{ m: 1, width: '15ch' }}>
            <InputLabel>Stock ID</InputLabel>
            <Select
              name="stock_id"
              value={values.stock_id}
              onChange={handleChange}
            >
              {[...Array(20)].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, width: '15ch' }}>
            <InputLabel>Buy or Sell</InputLabel>
            <Select name="is_buy" value={values.is_buy} onChange={handleChange}>
              <MenuItem value="">Choose</MenuItem>
              <MenuItem value="true">Buy</MenuItem>
              <MenuItem value="false">Sell</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, width: '15ch' }}>
            <InputLabel>Order Type</InputLabel>
            <Select
              name="order_type"
              value={values.order_type}
              onChange={handleChange}
            >
              <MenuItem value="">Choose</MenuItem>
              <MenuItem value="LIMIT">LIMIT</MenuItem>
              <MenuItem value="MARKET">MARKET</MenuItem>
            </Select>
          </FormControl>

          <TextField
            sx={{ m: 1, width: '15ch' }}
            type="number"
            label="Quantity"
            name="quantity"
            value={values.quantity}
            onChange={handleChange}
          />

          <TextField
            sx={{ m: 1, width: '15ch' }}
            type="number"
            label="Price"
            name="price"
            value={values.price}
            onChange={handleChange}
            disabled={values.order_type === 'MARKET'}
          />

          <div>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default StockPlaceOrderComponent
