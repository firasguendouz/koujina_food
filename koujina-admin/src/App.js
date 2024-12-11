// src/App.js

import './App.css';

import { AuthContext, AuthProvider } from './context/AuthContext'; // Import AuthContext and AuthProvider
import { Navigate, Route, HashRouter as Router, Routes } from 'react-router-dom'; // Use HashRouter instead of BrowserRouter
import React, { useContext } from 'react'; // Import useContext

import AuthPage from './pages/Auth/AuthPage';
import { BasketProvider } from './context/BasketContext';
import CookiesPolicy from './components/Layouts/Footer/Policies/CookiesPolicy';
import Footer from './pages/Layouts/Footer';
import HomePage from './pages/Home/HomePage';
import LegalMentions from './components/Layouts/Footer/Policies/LegalMentions';
import Menu from './pages/Menu/Menu';
import Navbar from './pages/Layouts/Navbar';
import NotFound from './pages/ErrorPage/ErrorPage';
import NotificationManagement from './pages/Notifications/NotificationManagement';
import OrderManagement from './pages/Orders/OrderManagement';
import OrderSuccess from './pages/Payment/OrderSuccess';
import Payment from './pages/Payment/Payment';
import PrivacyPolicy from './components/Layouts/Footer/Policies/PrivacyPolicy';
import ProfileManagement from './pages/Profile/ProfileManagement';

const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useContext(AuthContext); // Access isLoggedIn from AuthContext
  return isLoggedIn ? element : <Navigate to="/Auth" replace />;
};

const App = () => {
  return (
    <Router> {/* Use HashRouter here */}
      <AuthProvider>
        <BasketProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Auth" element={<AuthPage />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/CookiesPolicy" element={<CookiesPolicy />} />
            <Route path="/LegalMentions" element={<LegalMentions />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />

            <Route path="/order-success" element={<PrivateRoute element={<OrderSuccess />} />} />
            <Route path="/Payment" element={<PrivateRoute element={<Payment />} />} />
            <Route path="/ProfileManagement" element={<PrivateRoute element={<ProfileManagement />} />} />
            <Route path="/OrderManagement" element={<PrivateRoute element={<OrderManagement />} />} />
            <Route path="/NotificationManagement" element={<PrivateRoute element={<NotificationManagement />} />} />
            <Route path="*" element={<NotFound />} /> {/* 404 route */}
          </Routes>
          <Footer />
        </BasketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
