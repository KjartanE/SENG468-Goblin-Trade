import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import { useAuth } from '../contexts/AuthContext'
import { Container } from '@mui/material'

export const loginSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required').min(3, 'Too Short!'),
})

function Login() {
  const authContext = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (loginDetails: {
    username: string
    password: string
  }) => {
    try {
      const user = await authContext.login(
        loginDetails.username,
        loginDetails.password
      )

      if (user) {
        navigate('/user')
      }
    } catch (error) {
      console.log(error) //TODO: Add error handling here || SNACKBAR for error
    }
  }

  return (
    <Container maxWidth="xl">
      <Box>
        <p>Login Page</p>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={values => {
            handleLogin(values)
          }}
          validationSchema={loginSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }: any) => (
            <Box>
              <Box m={2}>
                <TextField
                  fullWidth
                  helperText={
                    errors.username && touched.username && errors.username
                  }
                  id="username"
                  label="Username"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter username id / username"
                  type="username"
                  value={values.username}
                  variant="outlined"
                />
              </Box>
              <Box m={2}>
                <TextField
                  fullWidth
                  helperText={
                    errors.password && touched.password && errors.password
                  }
                  label="Password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter password"
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
              </Box>
              <Box m={2}>
                <Button
                  fullWidth
                  onClick={handleSubmit}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Login
                </Button>
              </Box>
            </Box>
          )}
        </Formik>
      </Box>
    </Container>
  )
}

export default Login
