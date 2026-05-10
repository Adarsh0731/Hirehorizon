import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { JobDetails } from './pages/JobDetails';
import { SearchJobs } from './pages/SearchJobs';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { Applications } from './pages/Applications';
import { SavedJobs } from './pages/SavedJobs';
import { useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<SearchJobs />} />
            <Route path="job/:id" element={<JobDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            <Route path="profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="dashboard" element={
              <PrivateRoute>
                <EmployerDashboard />
              </PrivateRoute>
            } />
            <Route path="applications" element={
              <PrivateRoute>
                <Applications />
              </PrivateRoute>
            } />
            <Route path="saved" element={
              <PrivateRoute>
                <SavedJobs />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
