import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'

const BookingForm = ({ event }) => {
    const [ticketsBooked, setTicketsBooked] = useState(1)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await api.post('/bookings', {
                eventId: event._id,
                ticketsBooked
            })

            toast.success('Booking successful!')
            navigate('/tickets') // Redirect to tickets page after successful booking
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to book tickets')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Tickets</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="tickets" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Tickets
                    </label>
                    <input
                        type="number"
                        id="tickets"
                        min="1"
                        max={event.remainingTickets}
                        value={ticketsBooked}
                        onChange={(e) => setTicketsBooked(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Available tickets: {event.remainingTickets}
                    </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price per ticket:</span>
                        <span className="font-medium">${event.ticketPrice}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Total price:</span>
                        <span className="font-bold text-lg">${(ticketsBooked * event.ticketPrice).toFixed(2)}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    )
}

export default BookingForm 