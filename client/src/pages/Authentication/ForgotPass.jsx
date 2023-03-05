import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';


export const ForgotPass = () => {
  const [error, setError] = useState();
  const [forgot, setForgot] = useState();
  const onChangeForgot = ({ target }) => {
    const { name, value } = target;
    setForgot(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const onSubmitForgot = async (e) => {
    e.preventDefault();
    try {
      const resetPass = await fetch(`/api/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(forgot)
      })
      if (resetPass.ok) {
        const resetJson = await resetPass.json();
        setError(resetJson)
        console.log(resetJson)
      }
    } catch (err) {
      console.log(err)
    }
    console.log(forgot)
  }
  return (
    <div className='body-container-login'>
      <Helmet>
        <title>JMI | Forgot Page</title>
        <meta name="forgot page" content="This is the Forgot Section" />
      </Helmet>
      <div className='login-container'>
        <h1 className='login-header'>Forgot Password</h1>
        <div
          className={error && error.message ? 'login-success' : ''}
        >
          <p>{error && error.message}</p>
        </div>
        <form onSubmit={onSubmitForgot}>
          <div className='input-login'>
            <div className='username-input'>
              <label htmlFor='username'>Email: </label><br />
              <input type='email' name='email' id='username' placeholder='Email' onChange={onChangeForgot} />
            </div>
            <div className='login-button'>
              <button type='submit' className='button-style'>
                Forgot Password
              </button>
            </div>
            <div className='register-account'>
              <p>Already have an account? <Link to='/login' className='register-now'>Login now!</Link></p>
            </div >
          </div >
        </form >

      </div >

    </div >
  )
}