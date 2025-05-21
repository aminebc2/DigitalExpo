import React, { useEffect, useState } from 'react';
import AssociationService from "../../service/AssociationService";
import './VolunteersListPage.css';

const VolunteersListPage = ({ associationId }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get association ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await AssociationService.getVolunteers(volunteerId);

                const volunteersList = response?.volunteerList;

                if (Array.isArray(volunteersList)) {
                    setVolunteers(volunteersList);
                } else {
                    setVolunteers([]);
                }
                setLoading(false);
            } catch (error) {
                setError('Error fetching volunteers');
                setVolunteers([]);
                setLoading(false);
            }
        };

        if (volunteerId) fetchVolunteers();
    }, [volunteerId]);

    const formatAvailableDays = (days) => {
        return days ? days.join(', ') : 'No days available';
    };

    return (
        <div className="volunteers-container">
            <h2 className="title">Our Volunteers</h2>
            {loading ? (
                <div className="loading">Loading volunteers...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : volunteers.length === 0 ? (
                <div className="no-volunteers">No volunteers found</div>
            ) : (
                <div className="volunteer-list">
                    {volunteers.map((volunteer) => (
                        <div className="volunteer-card" key={volunteer.id}>
                            <div className="volunteer-info">
                                <h4 className="volunteer-name">{volunteer.username || 'Unnamed Volunteer'}</h4>
                                <p className="volunteer-email"><strong>Email:</strong> {volunteer.email}</p>
                                <p className="volunteer-phone"><strong>Phone:</strong> {volunteer.phoneNumber}</p>
                                <p className="volunteer-available-days"><strong>Available Days:</strong> {formatAvailableDays(volunteer.availableDays)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VolunteersListPage;