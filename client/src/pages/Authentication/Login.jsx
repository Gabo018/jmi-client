import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState();
  const [error, setError] = useState();
  const onChangeLogin = ({ target }) => {
    const { name, value } = target;
    setLogin(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const onSubmitLogin = async () => {
    const response = await fetch(`/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(login)
    })
    const responseJson = await response.json();
    setError(responseJson)
    if (responseJson.token) {
      localStorage.setItem('token', responseJson.token)
      navigate('/index');
    }
  }


  return (
    <div className='body-container-login'>
      <div className='login-container'>
        <h1 className='login-header'>Login</h1>
        <div
          className={error && error.message ? 'login-error' : ''}
        >
          <p>{error && error.message}</p>
        </div>
        <div className='input-login'>
          <div className='username-input'>
            <label htmlFor='username'>Email: </label><br />
            <input type='email' name='email' id='username' placeholder='Email or ID' onChange={onChangeLogin} />
          </div>
          <div className='password-input'>
            <label htmlFor='password'>Password: </label><br />
            <input type='password' name='password' id='password' placeholder='Password' onChange={onChangeLogin} />
          </div>
          <div className='login-button'>
            <button type='button' className='button-style' onClick={onSubmitLogin}>
              Login
            </button>
          </div>
          <div className='register-account'>
            <p>Forgot your password ? <Link to='/forgot' style={{ fontWeight: 'normal', textDecoration: 'underline' }}>Reset your password</Link></p>
            <p>Don't have an account? <Link to='/register' className='register-now'>Register now!</Link></p>
          </div>
        </div>
      </div>

    </div>
  )
}
