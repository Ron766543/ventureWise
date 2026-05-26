import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider }  from './context/AuthContext';
import { AppProvider }   from './context/AppContext';
import Navbar            from './components/shared/Navbar';
import Footer            from './components/shared/Footer';
import { ProtectedRoute } from './components/shared/UI';

import Landing           from './pages/Landing';
import { Login, Register } from './pages/AuthForms';
import Assessment        from './pages/Assessment';
import Ideas             from './pages/Ideas';
import IdeaDetail        from './pages/IdeaDetail';
import Dashboard         from './pages/Dashboard';
import MentorDirectory   from './pages/MentorDirectory';
import Training          from './pages/Training';
import AdminPanel        from './pages/AdminPanel';

import { GraduationCap, AlertTriangle, Home } from 'lucide-react';

function BecomeMentor() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <GraduationCap size={40} className="text-emerald-600" />
      </div>
      <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">Become a Mentor</h1>
      <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
        Share your experience and help aspiring entrepreneurs build their futures.
        You need an account to register as a mentor.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/register" className="btn-primary px-8">Create an Account</Link>
        <Link to="/login"    className="btn-secondary px-8">Sign In</Link>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <AlertTriangle size={36} className="text-slate-400" />
      </div>
      <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">Page Not Found</h1>
      <p className="text-slate-500 mb-8">This page doesn&apos;t exist or has been moved.</p>
      <Link to="/" className="btn-primary px-8">
        <Home size={16} /> Go Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                {/* public */}
                <Route path="/"              element={<Landing />} />
                <Route path="/login"         element={<Login />} />
                <Route path="/register"      element={<Register />} />
                <Route path="/ideas"         element={<Ideas />} />
                <Route path="/ideas/:id"     element={<IdeaDetail />} />
                <Route path="/mentors"       element={<MentorDirectory />} />
                <Route path="/training"      element={<Training />} />
                <Route path="/become-mentor" element={<BecomeMentor />} />

                {/* protect — any logged-in user */}
                <Route path="/assessment" element={
                  <ProtectedRoute><Assessment /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />

                {/* protect — admin only */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>
                } />

                <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
                <Route path="*"        element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </div>

          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            toastStyle={{
              borderRadius: '14px',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '14px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
