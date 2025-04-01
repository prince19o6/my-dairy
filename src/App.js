import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { CartProvider } from './context/CartContext';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';

import Settings from './pages/admin/Settings';
import Help from './pages/admin/Help';

// Main pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import Checkout from './pages/Checkout'; 
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminLogin from './pages/AdminLogin';
import Error404 from './Error/Error404';
import Profile from './pages/Profile';

// Components and Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ShoppingCart from './components/ShoppingCart';

// Main Layout Component
const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
      {/* <TempCart /> */}
    </Box>
  );
};

function App() {
  return (
    <CartProvider>
      <ShoppingCart />
          <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<ContactPage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
        </Route>
        <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
         
        </Route>

        <Route path="/admin" element={<AdminLogin />} />
            
            {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
          <Route path="products" element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          } />
          <Route path="orders" element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          } />
          <Route path="users" element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          } />
        
          <Route path="settings" element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          } />
          <Route path="help" element={
                <AdminRoute>
              <Help />
                </AdminRoute>
          } />
        </Route>

        {/* Redirect unmatched routes to home */}
        <Route path="*" element={<Error404/>} />
          </Routes>
    </CartProvider>
  );
}

export default App; 