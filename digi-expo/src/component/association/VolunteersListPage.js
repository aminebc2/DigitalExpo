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
        <div className="vol-directory">
            <div className="vol-directory__header">
                <h2 className="vol-directory__title">
                    <FaUserFriends className="vol-directory__icon" />
                    <span>Liste des Bénévoles</span>
                </h2>
            </div>

            {loading ? (
                <div className="vol-directory__loading">
                    <div className="vol-directory__spinner" />
                    <p>Loading volunteers...</p>
                </div>
            ) : error ? (
                <div className="vol-directory__error">
                    <FaUser size={48} />
                    <p>{error}</p>
                </div>
            ) : volunteers.length === 0 ? (
                <div className="vol-directory__empty">
                    <FaUser size={48} />
                    <p>No volunteers found</p>
                </div>
            ) : (
                <div className="vol-directory__grid">
                    {volunteers.map((volunteer) => (
                        <div className="vol-member" key={volunteer.id}>
                            <div className="vol-member__header">
                                <div className="vol-member__avatar">
                                    <FaUser />
                                </div>
                                <h4 className="vol-member__name">
                                    {volunteer.username || 'Unnamed Volunteer'}
                                </h4>
                            </div>
                            <div className="vol-member__content">
                                <div className="vol-member__field">
                                    <FaEnvelope className="vol-member__field-icon" />
                                    <div className="vol-member__field-content">
                                        <span className="vol-member__field-label">Email</span>
                                        <span className="vol-member__field-value">{volunteer.email}</span>
                                    </div>
                                </div>
                                <div className="vol-member__field">
                                    <FaPhone className="vol-member__field-icon" />
                                    <div className="vol-member__field-content">
                                        <span className="vol-member__field-label">Phone</span>
                                        <span className="vol-member__field-value">
                                            {volunteer.phoneNumber || 'Not provided'}
                                        </span>
                                    </div>
                                </div>
                                <div className="vol-member__field">
                                    <FaCalendarAlt className="vol-member__field-icon" />
                                    <div className="vol-member__field-content">
                                        <span className="vol-member__field-label">Available Days</span>
                                        <span className="vol-member__field-value">
                                            {formatAvailableDays(volunteer.availableDays)}
                                        </span>
                                    </div>
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
