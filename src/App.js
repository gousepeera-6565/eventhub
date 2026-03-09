import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth Components
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';

// Planner Components
import CreateEventForm from './components/planner/CreateEventForm';
import AddResourceForm from './components/planner/AddResourceForm';
import ResourceAllocatePage from './components/planner/ResourceAllocatePage';
import ViewEventsPage from './components/planner/ViewEventsPage';

// Staff Components
import StaffEventPage from './components/staff/StaffEventPage';
import UpdateSetupPage from './components/staff/UpdateSetupPage';

// Client Components
import BookingDetailsPage from './components/client/BookingDetailsPage';

// Auth Service
import authService from './components/services/authService';

function App() {
  const [user, setUser] = useState(authService.getCurrentUser());

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              user ? (
                <Navigate to={`/${user.role}`} replace />
              ) : (
                <div className="home-page">
                  <h1>Welcome to EventHub</h1>
                  <p>Your complete event management solution</p>
                  <div className="home-buttons">
                    <a href="/login" className="btn btn-primary">Login</a>
                    <a href="/register" className="btn btn-secondary">Register</a>
                  </div>
                </div>
              )
            } />
            
            <Route path="/login" element={
              user ? <Navigate to={`/${user.role}`} replace /> : 
              <LoginPage onLogin={handleLogin} />
            } />
            
            <Route path="/register" element={
              user ? <Navigate to={`/${user.role}`} replace /> : 
              <RegistrationPage onLogin={handleLogin} />
            } />

            {/* Planner Routes */}
            <Route path="/planner" element={
              <ProtectedRoute allowedRoles={['planner', 'admin']}>
                <ViewEventsPage />
              </ProtectedRoute>
            } />
            <Route path="/planner/events" element={
              <ProtectedRoute allowedRoles={['planner', 'admin']}>
                <ViewEventsPage />
              </ProtectedRoute>
            } />
            <Route path="/planner/create-event" element={
              <ProtectedRoute allowedRoles={['planner', 'admin']}>
                <CreateEventForm />
              </ProtectedRoute>
            } />
            <Route path="/planner/add-resource" element={
              <ProtectedRoute allowedRoles={['planner', 'admin']}>
                <AddResourceForm />
              </ProtectedRoute>
            } />
            <Route path="/planner/allocate-resource" element={
              <ProtectedRoute allowedRoles={['planner', 'admin']}>
                <ResourceAllocatePage />
              </ProtectedRoute>
            } />

            {/* Staff Routes */}
            <Route path="/staff" element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffEventPage />
              </ProtectedRoute>
            } />
            <Route path="/staff/events" element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffEventPage />
              </ProtectedRoute>
            } />
            <Route path="/staff/update-setup" element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <UpdateSetupPage />
              </ProtectedRoute>
            } />

            {/* Client Routes */}
            <Route path="/client" element={
              <ProtectedRoute allowedRoles={['client']}>
                <BookingDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/client/bookings" element={
              <ProtectedRoute allowedRoles={['client']}>
                <BookingDetailsPage />
              </ProtectedRoute>
            } />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

