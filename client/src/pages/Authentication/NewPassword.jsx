import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';


export const NewPassword = () => {
  // const { token } = useParams();
  const searchParams = new URLSearchParams(document.location.search)
  const token = searchParams.get('token')
  const [error, setError] = useState();
  const [password, setNewPassword] = useState();
  const onChangePassword = ({ target }) => {
    const { name, value } = target;
    setNewPassword(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const onSubmitPassword = async (e) => {
    e.preventDefault();
    console.log(password)
    if (password.password === password.confirmPassword) {
      const setNewPass = await fetch(`/api/new-password/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(password)
      })
      const newPassJson = await setNewPass.json();
      setError(newPassJson)
    } else {
      setError({ code: 409, message: 'New password and confirm password do not match' })
    }
  }

  return (
    <div className='body-container-login'>
      <div className='login-container'>
        <h1 className='login-header'>Reset Password</h1>
        <div
          className={error && error?.code === (409 || 500 || 403) ? 'reset-error' : error?.code === 200 ? 'reset-success' : null}
        >
          <p>{error && error.message}</p>
        </div>
        <div className='input-login'>
          <div className='username-input'>
            <label htmlFor='username'>New Password: </label><br />
            <input type='password' name='password' id='username' placeholder='New password' onChange={onChangePassword} />
          </div>
          <div className='password-input'>
            <label htmlFor='password'>Confirm New Password: </label><br />
            <input type='password' name='confirmPassword' id='password' placeholder='Confirm new password' onChange={onChangePassword} />
          </div>
          <div className='login-button'>
            <button type='button' className='button-style' onClick={onSubmitPassword}>
              Confirm
            </button>
          </div>
          <div className='register-account'>
            <p>Already have an account? <Link to='/login' className='register-now'>Login now!</Link></p>
            <p>Don't have an account? <Link to='/register' className='register-now'>Register now!</Link></p>
          </div>
        </div>
      </div>

    </div >
  )
}
