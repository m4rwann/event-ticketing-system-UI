import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ForgotPassword = () => {
    const [step, setStep] = useState(1) // 1: email, 2: OTP, 3: new password
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const { forgotPassword, resetPassword } = useAuth()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSendOTP = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await forgotPassword(formData.email)
            if (result.success) {
                setStep(2)
                setSuccess('OTP has been sent to your email')
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError('An error occurred while sending OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const result = await resetPassword(
                formData.email,
                formData.otp,
                formData.newPassword
            )

            if (result.success) {
                setStep(3)
                setSuccess('Password has been reset successfully')
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError('An error occurred while resetting password')
        } finally {
            setLoading(false)
        }
    }

    const renderStep1 = () => (
        <form onSubmit={handleSendOTP} className="mt-8 space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send OTP'}
                </button>
            </div>
        </form>
    )

    const renderStep2 = () => (
        <form onSubmit={handleVerifyOTP} className="mt-8 space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{success}</span>
                </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <label htmlFor="otp" className="sr-only">OTP</label>
                    <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="newPassword" className="sr-only">New password</label>
                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="New password"
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="sr-only">Confirm password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </div>
        </form>
    )

    const renderStep3 = () => (
        <div className="mt-8 space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{success}</span>
            </div>
            <div className="text-center">
                <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Return to login
                </Link>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {step === 1 && 'Reset your password'}
                        {step === 2 && 'Enter OTP and new password'}
                        {step === 3 && 'Password reset successful'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {step === 1 && 'Enter your email address to receive a reset code'}
                        {step === 2 && 'Enter the OTP sent to your email and your new password'}
                        {step === 3 && 'Your password has been reset successfully'}
                    </p>
                </div>

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}

                {step !== 3 && (
                    <div className="text-center">
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Back to login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword 