import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainButton } from '@twa-dev/sdk/react';
import WebApp from '@twa-dev/sdk';

const Layout = ({ showPopup }) => {
  return (
    <div className="flex flex-col justify-start items-center pt-10 w-screen h-screen overflow-hidden">
      <Outlet />
      <MainButton text='Итог' onClick={showPopup} />
    </div>
  );
};

export default Layout;