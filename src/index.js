import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Kitchen from './components/Kitchen/Kitchen';
import Bar from './components/Bar/Bar';
import Mangal from './components/Mangal/Mangal';
import House from './components/House/House';

import { PrimeReactProvider } from 'primereact/api';

import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';
        

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
    <PrimeReactProvider>
        <RouterProvider router={router} />
    </PrimeReactProvider>
  </React.StrictMode>
);

