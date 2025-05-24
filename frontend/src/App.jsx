import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import MainLayout from './common/MainLayout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import EventDetails from './pages/EventDetails'
import MyTickets from './pages/MyTickets'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Main layout routes */}
          <Route path="/" element={<MainLayout />}>
            {/* Public routes within main layout */}
            <Route index element={<Home />} />
            <Route path="/events/:id" element={<EventDetails />} />

            {/* Protected routes */}
            <Route
              path="/tickets"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <MyTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
