import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography' // Import Typography for the error message
import { useAuth } from '../contexts/AuthContext'
import { Container } from '@mui/material'

export const loginSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required').min(3, 'Too Short!'),
})

function Login() {
  const authContext = useAuth()
  const navigate = useNavigate()
  const [loginFailed, setLoginFailed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
      console.log(error)
      setLoginFailed(true)
      setErrorMessage('* Invalid credentials')
    }
  }

  return (
    <Container maxWidth="xl">
      <Box>
        <p>Login Page</p>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={(values, { setSubmitting }) => {
            handleLogin(values).finally(() => setSubmitting(false))
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
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
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
              {loginFailed && errorMessage && (
                <Box m={2}>
                  <Typography color="error">{errorMessage}</Typography>
                </Box>
              )}
              <Box m={2}>
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Login
                </Button>
              </Box>
              {loginFailed && (
                <Box m={2}>
                  <Button
                    fullWidth
                    size="large"
                    href="/register"
                    variant="contained"
                  >
                    Register
                  </Button>
                </Box>
              )}
            </form>
          )}
        </Formik>
      </Box>
    </Container>
  )
}

export default Login
