import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        await logout()
    }

    return (
        <header className="bg-white shadow-sm">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-xl font-bold text-gray-800">
                            Event Ticketing
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                        <Link to="/events" className="text-gray-600 hover:text-gray-900">Events</Link>
                        {user ? (
                            <>
                                <Link to="/tickets" className="text-gray-600 hover:text-gray-900">My Tickets</Link>
                                <span className="text-gray-600">Hi, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar 