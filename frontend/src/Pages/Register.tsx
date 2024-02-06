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

function Register() {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          backgroundImage:
            "url('https://bg3.wiki/w/images/4/4e/Goblin-face.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '65vh',
        }}
      >
        <Box
          sx={{
            width: '50%', // Set the width to 60%
            margin: 'auto', // Center the box horizontally
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent white background
            padding: '20px', // Add some padding
            borderRadius: '10px', // Add border radius for a rounded look
            alignSelf: 'flex-end', // Align the box to the right
          }}
        >
          <p>Registeration Page</p>
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting }) => {
              // You can add your login logic here
              console.log('Submitting:', values)
              setSubmitting(false) // For demonstration, setSubmitting to false
            }}
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
                  <Button
                    fullWidth
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
