import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/queries';
import Auth from '../utils/auth';

const LoginForm = () => {
  // Manages form state for email and password inputs
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false); // Handles form validation state
  const [showAlert, setShowAlert] = useState(false); // Controls visibility of error alerts

  const [login, { error }] = useMutation(LOGIN_USER); 

  const handleInputChange = (event) => {
    // Updates form data when user types in inputs
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validates form fields before proceeding
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Executes login mutation with user-provided data
      const { data } = await login({
        variables: { ...userFormData }
      });

      // If login is successful, token is saved and user is authenticated
      if (data && data.login && data.login.token) {
        Auth.login(data.login.token);
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      console.error(err);
      setShowAlert(true); 
    }

    // Resets form fields after submission
    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert || error} variant='danger'>
          {error ? error.message : 'Something went wrong with your login credentials!'}
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
