import React, { useState, useEffect } from 'react';
import VolunteerService from '../../service/VolunteerService';
import {
    FaCalendarAlt,
    FaInfoCircle,
    FaBuilding,
    FaEnvelope,
    FaUserTie,
    FaPhone,
    FaSpinner,
    FaTimes,
    FaArrowRight
} from 'react-icons/fa';
import './SessionPage.css';

const SessionPage = () => {
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await VolunteerService.getSessions(volunteerId);
                const sessionsList = response?.data || [];

                if (Array.isArray(sessionsList)) {
                    setSessions(sessionsList);
                } else {
                    console.warn('sessionList is not an array:', sessionsList);
                    setSessions([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sessions:', error);
                setSessions([]);
                setLoading(false);
            }
        };

        if (volunteerId) {
            fetchSessions();
        }
    }, [volunteerId]);

    const handleShowDetails = (session) => {
        setSelectedSession(session);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedSession(null);
        setShowModal(false);
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'status-indicator pending';
            case 'confirmed':
                return 'status-indicator confirmed';
            case 'cancelled':
                return 'status-indicator cancelled';
            case 'completed':
                return 'status-indicator completed';
            default:
                return 'status-indicator pending';
        }
    };

    return (
        <div className="volunteer-dashboard">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2 className="dashboard-title">
                        <FaCalendarAlt/>
                        <span>Mes Sessions Assignées</span>
                    </h2>
                </div>

                {error && (
                    <div className="alert-box">
                        <FaInfoCircle />
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="loading-box">
                        <FaSpinner className="loading-spinner" />
                        <p className="loading-text">Chargement des sessions...</p>
                    </div>
                ) : sessions.length > 0 ? (
                    <div className="sessions-layout">
                        {sessions.map((session) => (
                            <div className="session-item" key={session.id}>
                                <div className="session-content">
                                    <div className="session-date">
                                        <FaCalendarAlt />
                                        <span>{session.date}</span>
                                    </div>

                                    <div className={getStatusClass(session.status)}>
                                        {session.status}
                                    </div>

                                    <button
                                        className="view-details"
                                        onClick={() => handleShowDetails(session)}
                                    >
                                        <span>Voir Détails</span>
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FaCalendarAlt />
                        <p>Aucune session assignée.</p>
                    </div>
                )}

                {showModal && selectedSession && (
                    <div className="detail-overlay">
                        <div className="detail-container">
                            <div className="detail-header">
                                <h3 className="detail-title">
                                    <FaCalendarAlt />
                                    Détails de la session
                                </h3>
                                <button className="detail-close" onClick={handleCloseModal}>
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="detail-body">
                                <div className="detail-section">
                                    <div className="detail-row">
                                        <div className="detail-field">
                                            <div className="detail-icon">
                                                <FaCalendarAlt />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">Date</span>
                                                <span className="detail-value">{selectedSession.date}</span>
                                            </div>
                                        </div>
                                        <div className={getStatusClass(selectedSession.status)}>
                                            {selectedSession.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4 className="association-title">
                                        <FaBuilding />
                                        Information de l'Association
                                    </h4>
                                    <div className="association-grid">
                                        <div className="detail-field">
                                            <div className="detail-icon">
                                                <FaBuilding />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">Association</span>
                                                <span className="detail-value">
                                                    {selectedSession.association?.name || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="detail-field">
                                            <div className="detail-icon">
                                                <FaEnvelope />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">Email</span>
                                                <span className="detail-value">
                                                    {selectedSession.association?.email || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="detail-field">
                                            <div className="detail-icon">
                                                <FaUserTie />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">Responsable</span>
                                                <span className="detail-value">
                                                    {selectedSession.association?.responsableName || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="detail-field">
                                            <div className="detail-icon">
                                                <FaPhone />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">Téléphone</span>
                                                <span className="detail-value">
                                                    {selectedSession.association?.responsablePhone || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="detail-action" onClick={handleCloseModal}>
                                    <FaTimes />
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionPage;
