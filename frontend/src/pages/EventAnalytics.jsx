import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const EventAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/users/events/analytics', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Find the specific event's analytics
                const eventAnalytics = response.data.find(event => event.eventId === id);
                if (!eventAnalytics) {
                    toast.error('Analytics not found for this event');
                    navigate('/my-events');
                    return;
                }

                setAnalytics(eventAnalytics);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch analytics');
                navigate('/my-events');
            }
        };

        fetchAnalytics();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const chartData = {
        labels: ['Booked Tickets', 'Remaining Tickets'],
        datasets: [
            {
                data: [parseFloat(analytics.percentage), 100 - parseFloat(analytics.percentage)],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(200, 200, 200, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(200, 200, 200, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw.toFixed(2)}%`;
                    }
                }
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Event Analytics</h1>
                    <button
                        onClick={() => navigate('/my-events')}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        Back to Events
                    </button>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">{analytics.title}</h2>
                    <p className="text-gray-600">
                        Date: {new Date(analytics.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                        Category: {analytics.category}
                    </p>
                </div>

                <div className="mb-6">
                    <div className="h-64">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700">
                        Booking Rate: {analytics.percentage}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventAnalytics; 