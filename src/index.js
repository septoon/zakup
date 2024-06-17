import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Kitchen from './components/Kitchen';
import Bar from './components/Bar';
import Mangal from './components/Mangal';
import House from './components/House';

import NotFound from './components/NotFound';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/zakup',
    element: <App/>,
    errorElement: <NotFound/>
  },
  {
    path: '/kitchen',
    element: <Kitchen/>
  },
  {
    path: '/bar',
    element: <Bar/>
  },
  {
    path: '/mangal',
    element: <Mangal/>
  },
  {
    path: '/house',
    element: <House/>
  },


])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>
);

