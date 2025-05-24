import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import api from '../services/api'
import BookingForm from '../components/events/BookingForm'

const EventDetails = () => {
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`)
                setEvent(response.data)
            } catch (error) {
                toast.error('Failed to fetch event details')
                navigate('/')
            } finally {
                setLoading(false)
            }
        }

        fetchEvent()
    }, [id, navigate])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!event) {
        return null
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Event Details */}
                <div className="space-y-6">
                    {event.image && (
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-96 object-cover rounded-lg shadow-lg"
                        />
                    )}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>
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
                                <h3 className="font-semibold text-gray-800">Status</h3>
                                <p className={`text-sm font-medium ${event.status === 'approved' ? 'text-green-600' :
                                    event.status === 'pending' ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                {event.status === 'approved' && event.remainingTickets > 0 && (
                    <div>
                        <BookingForm event={event} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default EventDetails 