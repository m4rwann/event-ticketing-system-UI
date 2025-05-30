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
import MyEvents from './pages/MyEvents'
import CreateEvent from './pages/CreateEvent'
import EditEvent from './pages/EditEvent'
import EventAnalytics from './pages/EventAnalytics'
import UserManagement from './pages/UserManagement'
import AllEvents from './pages/AllEvents'
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
                  <MyEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id/analytics"
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <EventAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-events"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AllEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <CreateEvent />
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
