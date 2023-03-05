import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const Register = () => {

  const [error, setError] = useState();
  const [register, setRegister] = useState();
  const onChangeRegister = ({ target }) => {
    const { name, value } = target;
    setRegister(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const onSubmitRegister = async () => {
    const registerUser = await fetch(`/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(register)
    })
    const registerJson = await registerUser.json();
    setError(registerJson)
  }

  return (
    <div className='body-container-login'>
      <div className='login-container'>
        <h1 className='login-header'>Register</h1>
        <div className='input-login'>
          <div className={error && error.status === 11000 ? 'register-error' : error && error.status === 200 ? 'register-success' : null}>
            <p>{error && error.message}</p>
          </div>
          <div className='username-input'>
            <label htmlFor='username'>Email: </label><br />
            <input type='email' name='email' id='username' placeholder='Email or ID' onChange={onChangeRegister} />
          </div>
          <div className='password-input'>
            <label htmlFor='password'>Password: </label><br />
            <input type='password' name='password' id='password' placeholder='Password' onChange={onChangeRegister} />
          </div>
          <div className='login-button'>
            <button type='button' className='button-style' onClick={onSubmitRegister}>
              Register
            </button>
          </div>
          <div className='register-account'>
            <p>Forgot your password ? <Link to='/forgot' style={{ fontWeight: 'normal', textDecoration: 'underline' }}>Reset your password</Link></p>
            <p>Already have an account? <Link to='/login' className='register-now'>Login now!</Link></p>
          </div>
        </div>
      </div>

    </div >
  )
}
