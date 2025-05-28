// frontend/src/components/layout/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
// You could also add a PublicFooter component here if you create one

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '70px' }}> {/* Add padding to offset fixed/sticky navbar height */}
        <Outlet /> {/* This is where nested route components (like CarListPage) will render */}
      </main>
      {/* <PublicFooter /> */}
    </>
  );
};

export default PublicLayout;
