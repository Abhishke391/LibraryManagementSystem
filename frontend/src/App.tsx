import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AouthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AouthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AouthProvider>
    </QueryClientProvider>
  );
}