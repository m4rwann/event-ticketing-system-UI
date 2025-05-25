import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                const response = await api.get('/users/events', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch your events. Please try again later.');
                toast.error('Failed to fetch your events');
                setLoading(false);
            }
        };

        fetchMyEvents();
    }, []);

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEvents(events.filter(event => event._id !== eventId));
                toast.success('Event deleted successfully');
            } catch (err) {
                toast.error('Failed to delete event');
            }
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
                <Link
                    to="/create-event"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Create New Event
                </Link>
            </div>

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
                            {event.isSoldOut && (
                                <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg">
                                    Sold Out
                                </div>
                            )}
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
                                <Link
                                    to={`/events/${event._id}/edit`}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </Link>
                                <Link
                                    to={`/events/${event._id}/analytics`}
                                    className="text-purple-600 hover:text-purple-800"
                                >
                                    View Analytics
                                </Link>
                                <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                                <Link
                                    to={`/events/${event._id}`}
                                    className="text-green-600 hover:text-green-800"
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
                    <p className="text-gray-500 text-lg">You haven't created any events yet.</p>
                    <Link
                        to="/create-event"
                        className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create Your First Event
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyEvents; 