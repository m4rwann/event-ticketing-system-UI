import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await api.get('/users/profile')
            setUser(response.data)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password })
            setUser(response.data.user)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            }
        }
    }

    const register = async (userData) => {
        try {
            await api.post('/register', userData)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            }
        }
    }

    const forgotPassword = async (email) => {
        try {
            await api.post('/forgetPassword', { email })
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to process request'
            }
        }
    }

    const resetPassword = async (email, otp, newPassword) => {
        try {
            await api.put('/forgetPassword', { email, otp, newPassword })
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to reset password'
            }
        }
    }

    const logout = async () => {
        try {
            await api.post('/auth/logout')
            setUser(null)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Logout failed'
            }
        }
    }

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        checkAuth
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
} 