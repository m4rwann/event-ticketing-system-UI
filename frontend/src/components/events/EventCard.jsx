import { useState } from 'react'
import { Link } from 'react-router-dom'

const EventCard = ({ event }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200">
                    {event.image && (
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                        {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">{event.location}</p>
                    <p className="text-gray-600 text-sm mb-2">Category: {event.category}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-semibold">${event.ticketPrice}</span>
                        <span className="text-sm text-gray-600">
                            {event.remainingTickets} tickets left
                        </span>
                    </div>
                    <div className="mt-2">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {event.image && (
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                            )}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-800">Date</h3>
                                    <p className="text-gray-600">
                                        {new Date(event.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Location</h3>
                                    <p className="text-gray-600">{event.location}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Category</h3>
                                    <p className="text-gray-600">{event.category}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Description</h3>
                                    <p className="text-gray-600">{event.description}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Ticket Information</h3>
                                    <p className="text-gray-600">Price: ${event.ticketPrice}</p>
                                    <p className="text-gray-600">Available Tickets: {event.remainingTickets} of {event.totalTickets}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Status</h3>
                                    <p className={`text-sm font-medium ${event.status === 'approved' ? 'text-green-600' :
                                        event.status === 'pending' ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </p>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Close
                                    </button>
                                    {event.status === 'approved' && event.remainingTickets > 0 && (
                                        <Link
                                            to={`/events/${event._id}`}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Book Now
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EventCard 