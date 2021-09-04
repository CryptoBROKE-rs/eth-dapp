import { Navigate, useRoutes } from 'react-router-dom';
import { useState } from 'react';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import User from './pages/User';
import Home from './pages/Home';
import AddCamp from './pages/AddCampaign';
import NotFound from './pages/Page404';
import ToL2 from './pages/ToL2';

// ----------------------------------------------------------------------
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export default function Router(props) {
  const [state, setState] = useState(undefined);
  const handleLoggedIn = (auth) => {
    const payload = parseJwt(auth['accessToken'])['payload'];
    window.localStorage['username'] = payload['username'];
    window.localStorage['lastName'] = payload['lastName'];
    window.localStorage['firstName'] = payload['firstName'];
    window.localStorage['publicAddress'] = payload['publicAddress'];
    window.localStorage['email'] = payload['email'];
    window.localStorage['organisation'] = payload['organization'];
    window.localStorage['id'] = payload['id'];
    window.localStorage['jwt'] = auth['accessToken'];
    window.localStorage['layer'] = "L1";

    setState(payload);
  };

  const handleLoggedOut = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('lastName');
    localStorage.removeItem('firstName');
    localStorage.removeItem('publicAddress');
    localStorage.removeItem('email');
    localStorage.removeItem('organisation');
    localStorage.removeItem('id');
    localStorage.removeItem('jwt');
    setState(undefined);
  };
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'newCampaign', element: <AddCamp /> },
        { path: 'Layer2', element: <ToL2 /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        {
          path: 'login',
          element:
            state !== undefined ? (
              <Navigate to={'/dashboard/app'} />
            ) : (
              <Login onLoggedIn={handleLoggedIn} />
            )
        },
        { path: 'home', element: <Home onLoggedOut={handleLoggedOut} /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
