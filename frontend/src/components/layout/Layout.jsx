import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    // YAHAN BADLAAV KIYA GAYA HAI:
    // Humne naye theme colors ka istemal kiya hai
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;