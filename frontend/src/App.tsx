import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { CheckInPage } from './pages/CheckInPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <WalletProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route 
                path="/events" 
                element={
                  <ProtectedRoute>
                    <EventsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-tickets" 
                element={
                  <ProtectedRoute>
                    <MyTicketsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-event" 
                element={
                  <ProtectedRoute>
                    <CreateEventPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/check-in" 
                element={
                  <ProtectedRoute adminOnly>
                    <CheckInPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </WalletProvider>
  );
}

export default App;