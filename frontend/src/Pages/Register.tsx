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

export const registerSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required').min(3, 'Too Short!'),
  password2: Yup.string()
    .required('Required')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value
    }),
})

function Register() {
  const authContext = useAuth()
  const navigate = useNavigate()
  const [loginFailed, setLoginFailed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleregister = async (registerDetails: {
    username: string
    name: string
    password: string
    password2: string
  }) => {
    try {
      const userRegisterData = {
        username: registerDetails.username,
        name: registerDetails.name, // Authcontext asks for  email instead of name atm
        password1: registerDetails.password,
        password2: registerDetails.password2,
      }
      console.log('attempting to send register details')
      const user = await authContext.register(userRegisterData)
      
      if (user) {
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
      setLoginFailed(true)
      setErrorMessage('* Registration failed *')
    }
  }

  return (
    <Container maxWidth="xl">
      <Box>
        <Box
          sx={{
            width: '50%',
            margin: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <p>Registeration Page</p>
          <Formik
            initialValues={{
              name: '',
              username: '',
              password: '',
              password2: '',
            }}
            onSubmit={(values, { setSubmitting }) => {
              console.log('Submitting:', values)
              handleregister(values).finally(() => setSubmitting(false))
            }}
            validationSchema={registerSchema}
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
                    helperText={errors.name && touched.name && errors.name}
                    id="Name"
                    label="Name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter a Display name"
                    type="displayname"
                    value={values.name}
                    variant="outlined"
                    margin="normal"
                  />
                </Box>
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
                    margin="normal"
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
                    margin="normal"
                  />
                </Box>
                <Box m={2}>
                  <TextField
                    fullWidth
                    helperText={
                      (errors.password2 &&
                        touched.password2 &&
                        errors.password2) ||
                      (errors.password && touched.password)
                    }
                    label="Re-enter Password"
                    name="password2"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter password again"
                    type="password"
                    value={values.password2}
                    variant="outlined"
                    margin="normal"
                  />
                </Box>
                {loginFailed && errorMessage && (
                  <Box m={2}>
                    <Typography color="error">{errorMessage}</Typography>
                  </Box>
                )}
                <Box m={2}>
                  <Button
                    sx={{
                      width: '50%',
                    }}
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Register
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Container>
  )
}

export default Register
