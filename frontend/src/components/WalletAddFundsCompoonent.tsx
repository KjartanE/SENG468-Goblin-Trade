import { Formik, Form } from 'formik'
import { MenuItem, Button, TextField, Typography } from '@mui/material'
import { useWallet } from '../contexts/WalletContext'
import * as Yup from 'yup'
import { Fragment, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useNavigate } from 'react-router-dom'

const addFundsSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Required')
    .min(1, 'Enter a value greater than 0'),
})

function WalletAddFundsComponent() {
  const { wallet, addFundsError, refreshWallet, updateWallet } = useWallet()
  const [open, setOpen] = useState(false)
  const failureMessage = 'Something went wrong. Please refresh the page.'
  const successMessage = 'Funds added successfully!'
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
      <Typography mb={2}>Current balance: ${wallet?.balance}</Typography>
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
              {addFundsError ? failureMessage : successMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Return</Button>
          </DialogActions>
        </Dialog>
      </Fragment>

      <Formik
        initialValues={{ amount: '' }}
        onSubmit={values => {
          // Handle form submission here
          updateWallet(parseInt(values.amount))
          handleClickOpen()
        }}
        validationSchema={addFundsSchema}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            <div>
              <TextField
                sx={{ m: 1, width: '20ch' }}
                type="number"
                label="Amount to add"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                helperText={errors.amount && touched.amount && errors.amount}
              />
            </div>
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

export default WalletAddFundsComponent
