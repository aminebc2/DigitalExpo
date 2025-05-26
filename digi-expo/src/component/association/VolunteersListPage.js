import React, { useEffect, useState } from 'react';
import AssociationService from "../../service/AssociationService";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaUser, FaUserFriends } from 'react-icons/fa';
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
        if (!days || days.length === 0) return 'No days available';
        return days.map(day => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()).join(', ');
    };

    return (
        <div className="volunteers-container">
            <h2 className="page-title">
                <FaUserFriends />
                Liste des Bénévoles
            </h2>
            {loading ? (
                <div className="loading">
                    <div className="spinner" />
                    <p>Loading volunteers...</p>
                </div>
            ) : error ? (
                <div className="error-message">
                    <FaUser size={48} />
                    <p>{error}</p>
                </div>
            ) : volunteers.length === 0 ? (
                <div className="no-volunteers">
                    <FaUser size={48} />
                    <p>No volunteers found</p>
                </div>
            ) : (
                <div className="volunteer-list">
                    {volunteers.map((volunteer) => (
                        <div className="volunteer-card" key={volunteer.id}>
                            <div className="volunteer-info">
                                <h4 className="volunteer-name">
                                    <FaUser />
                                    {volunteer.username || 'Unnamed Volunteer'}
                                </h4>
                                <div className="volunteer-details">
                                    <p className="volunteer-email">
                                        <strong>
                                            <FaEnvelope />
                                            Email:
                                        </strong>
                                        {volunteer.email}
                                    </p>
                                    <p className="volunteer-phone">
                                        <strong>
                                            <FaPhone />
                                            Phone:
                                        </strong>
                                        {volunteer.phoneNumber || 'Not provided'}
                                    </p>
                                    <p className="volunteer-available-days">
                                        <strong>
                                            <FaCalendarAlt />
                                            Available:
                                        </strong>
                                        {formatAvailableDays(volunteer.availableDays)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VolunteersListPage;
