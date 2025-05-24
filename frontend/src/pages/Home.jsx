import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import EventCard from '../components/events/EventCard'
import sliderImage from '../assets/slider.jpg'

const Home = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events')
                setEvents(response.data)
                setLoading(false)
            } catch (err) {
                setError('Failed to fetch events')
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative w-full h-[500px] rounded-2xl shadow-lg overflow-hidden animate-fadeIn">
                <img
                    src={sliderImage}
                    alt="Event Slider"
                    className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Welcome to Event Ticketing</h1>
                    <p className="text-lg md:text-2xl text-gray-200 font-medium drop-shadow">Find and book tickets for your favorite events</p>
                </div>
            </div>

            {/* Events Section */}
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Upcoming Events</h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading events...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home 