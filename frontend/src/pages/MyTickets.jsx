import { useState, useEffect } from 'react';
import api from '../services/api';
import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const MyTickets = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/users/bookings');
            setBookings(response.data.bookings);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch bookings');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        try {
            await api.delete(`/bookings/${bookingId}`);
            toast.success('Booking cancelled successfully');
            // Refresh the bookings list
            fetchBookings();
        } catch (err) {
            toast.error('Failed to cancel booking');
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
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
            {bookings.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>You haven't booked any tickets yet.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold">{booking.event.title}</h2>
                                <span className={`px-3 py-1 rounded-full text-sm ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-600">
                                    <span className="font-medium">Event Date:</span>{' '}
                                    {new Date(booking.event.date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Location:</span> {booking.event.location}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Tickets:</span> {booking.ticketsBooked}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Total Price:</span> ${booking.totalPrice}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Booked on:</span>{' '}
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {booking.status === 'confirmed' && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => handleCancelBooking(booking._id)}
                                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                        <span>Cancel Booking</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTickets; 