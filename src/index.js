import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import Kitchen from './components/Kitchen/Kitchen';
import Bar from './components/Bar/Bar';
import Mangal from './components/Mangal/Mangal';
import House from './components/House/House';
import AllPurchases from './components/AllPurchases';

import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';

import NotFound from './components/NotFound';

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import store from './store';

import Layout from './Layout';
import { registerServiceWorker } from './pwaRegistration';

const basename = new URL(process.env.PUBLIC_URL || '/', window.location.origin).pathname;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <App /> },
      { path: 'zakup', element: <App /> },
      { path: 'kitchen', element: <Kitchen /> },
      { path: 'bar', element: <Bar /> },
      { path: 'mangal', element: <Mangal /> },
      { path: 'house', element: <House /> },
      { path: 'purchases', element: <AllPurchases /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  }
], { basename });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PrimeReactProvider>
        <RouterProvider router={router} />
      </PrimeReactProvider>
    </Provider>
  </React.StrictMode>
);

registerServiceWorker();
