import React, { useEffect, useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'



export const PrivateRoutes = () => {
  const [valToken, setValToken] = useState({ message: undefined });
  const location = useLocation()

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch(`/api/protected`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setValToken({ message: response.status });
        } else {
          setValToken({ message: response.status });
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkToken();
  }, []);

  if (valToken.message === undefined) {
    return null;
  }

  return valToken.message === 401 ? (
    <Navigate to='/login' state={{ from: location }} replace />
  ) : (
    valToken.message === 200 && <Outlet />
  );
}
