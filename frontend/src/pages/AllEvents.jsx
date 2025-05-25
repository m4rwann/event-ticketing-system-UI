import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                const response = await api.get('/events/all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch events. Please try again later.');
                toast.error('Failed to fetch events');
                setLoading(false);
            }
        };

        fetchAllEvents();
    }, []);

    const handleStatusUpdate = async (eventId, status) => {
        try {
            await api.put(`/events/${eventId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setEvents(events.map(event =>
                event._id === eventId ? { ...event, status } : event
            ));

            toast.success(`Event ${status} successfully`);
        } catch (err) {
            toast.error(`Failed to ${status} event`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">All Events</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div
                        key={event._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="relative h-48">
                            <img
                                src={event.image ? `http://localhost:3000/public/images/${event.image}` : 'public/images/placeholder.jpg'}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg ${event.status === 'approved' ? 'bg-green-500' :
                                event.status === 'rejected' ? 'bg-red-500' :
                                    'bg-yellow-500'
                                } text-white`}>
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </div>
                        </div>

                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
                            <p className="text-gray-600 mb-2">{new Date(event.date).toLocaleDateString()}</p>
                            <p className="text-gray-600 mb-2">{event.location}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-blue-600 font-semibold">
                                    ${event.ticketPrice}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {event.remainingTickets} tickets left
                                </span>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStatusUpdate(event._id, 'approved')}
                                        className={`px-4 py-2 rounded transition-colors ${event.status === 'approved'
                                            ? 'bg-green-600 text-white cursor-not-allowed'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                        disabled={event.status === 'approved'}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(event._id, 'rejected')}
                                        className={`px-4 py-2 rounded transition-colors ${event.status === 'rejected'
                                            ? 'bg-red-600 text-white cursor-not-allowed'
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                            }`}
                                        disabled={event.status === 'rejected'}
                                    >
                                        Reject
                                    </button>
                                </div>
                                <Link
                                    to={`/events/${event._id}`}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No events found.</p>
                </div>
            )}
        </div>
    );
};

export default AllEvents; 