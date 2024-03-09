import { Formik, Form } from 'formik'
import { IStockOrderForm } from '../types/stocks'
import { MenuItem, Button, TextField } from '@mui/material'
import { useStockTransactions } from '../contexts/StockTransactionsContext'
import * as Yup from 'yup'
import { Fragment, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useNavigate } from 'react-router-dom'

const placeOrderSchema = Yup.object().shape({
  stock_id: Yup.number().required('Required'),
  is_buy: Yup.boolean().required('Required'),
  order_type: Yup.string().required('Required'),
  quantity: Yup.number()
    .required('Required')
    .min(1, 'Enter a value greater than 0'),
  price: Yup.number().when('order_type', {
    is: (orderType: string) => orderType === 'LIMIT',
    then: () =>
      Yup.number().required('Required').min(1, 'Enter a value greater than 0'),
    otherwise: () => Yup.number().notRequired(),
  }),
})

const initialValues: IStockOrderForm = {
  stock_id: '',
  is_buy: '',
  order_type: '',
  quantity: '',
  price: '',
}

function StockPlaceOrderComponent() {
  const { orderErrors, placeStockOrder } = useStockTransactions()
  const [open, setOpen] = useState(false)
  const failureMessage = 'Something went wrong. Please refresh the page.'
  const successMessage = 'Order placed successfully!'
  const router = useNavigate()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    router('/user')
  }

  return (
    <div>
      <Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="submit-order-alert"
          aria-describedby="submit-order-description"
        >
          <DialogTitle id="submit-order-alert">{'Goblin Trade'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="submit-order-description">
              {orderErrors ? failureMessage : successMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Return</Button>
          </DialogActions>
        </Dialog>
      </Fragment>

      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          // Handle form submission here
          placeStockOrder(values)
          handleClickOpen()
        }}
        validationSchema={placeOrderSchema}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            <div>
              <TextField
                sx={{ m: 1, width: '10ch' }}
                select
                label="Stock ID"
                name="stock_id"
                value={values.stock_id}
                onChange={handleChange}
                defaultValue=""
                color="primary"
                helperText={
                  errors.stock_id && touched.stock_id && errors.stock_id
                }
              >
                {/* Hard coded stock IDs - Can pass in real IDs from API later if needed*/}
                {[...Array(20)].map((_, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {index + 1}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                sx={{ m: 1, width: '10ch' }}
                select
                label="Buy or Sell"
                name="is_buy"
                value={values.is_buy}
                onChange={handleChange}
                defaultValue=""
                helperText={errors.is_buy && touched.is_buy && errors.is_buy}
              >
                <MenuItem value={true as any}>Buy</MenuItem>
                <MenuItem value={false as any}>Sell</MenuItem>
              </TextField>

              <TextField
                sx={{ m: 1, width: '10ch' }}
                select
                label="Order Type"
                name="order_type"
                value={values.order_type}
                onChange={e => {
                  // Reset price when order type changes to MARKET
                  if (e.target.value === 'MARKET') {
                    setFieldValue('price', '') // Reset price to empty string
                  }
                  handleChange(e)
                }}
                defaultValue=""
                helperText={
                  errors.order_type && touched.order_type && errors.order_type
                }
              >
                <MenuItem value="LIMIT">LIMIT</MenuItem>
                <MenuItem value="MARKET">MARKET</MenuItem>
              </TextField>
            </div>
            <TextField
              sx={{ m: 1, width: '10ch' }}
              type="number"
              label="Quantity"
              name="quantity"
              value={values.quantity}
              onChange={handleChange}
              helperText={
                errors.quantity && touched.quantity && errors.quantity
              }
            />

            <TextField
              sx={{ m: 1, width: '10ch' }}
              type="number"
              label="Price"
              name="price"
              value={values.price}
              onChange={handleChange}
              disabled={values.order_type === 'MARKET'}
              helperText={errors.price && touched.price && errors.price}
            />

            <div>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ m: 4 }}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default StockPlaceOrderComponent
