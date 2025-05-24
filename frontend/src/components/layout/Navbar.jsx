import { Link } from 'react-router-dom'

const Navbar = () => {
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
                        <Link to="/tickets" className="text-gray-600 hover:text-gray-900">My Tickets</Link>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar 