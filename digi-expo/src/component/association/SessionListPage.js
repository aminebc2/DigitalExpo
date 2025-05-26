import React, { useState, useEffect } from 'react';
import AssociationService from '../../service/AssociationService';
import { FaCalendarAlt, FaInfoCircle, FaSpinner, FaTimes, FaArrowRight, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import './SessionListPage.css';

const SessionListPage = () => {
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const associationId = user?.id;

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await AssociationService.getSessions(associationId);
                const sessionsList = response?.sessionList || [];
                setSessions(Array.isArray(sessionsList) ? sessionsList : []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sessions:', error);
                setError('Erreur lors du chargement des sessions');
                setSessions([]);
                setLoading(false);
            }
        };

        if (associationId) fetchSessions();
    }, [associationId]);

    const handleShowDetails = (session) => {
        setSelectedSession(session);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedSession(null);
        setShowModal(false);
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'session-status-badge pending';
            case 'confirmed':
                return 'session-status-badge confirmed';
            case 'cancelled':
                return 'session-status-badge cancelled';
            case 'completed':
                return 'session-status-badge completed';
            default:
                return 'session-status-badge pending';
        }
    };

    return (
        <div className="sessions-page">
            <div className="sessions-content">
                <h2 className="page-title">
                    <FaCalendarAlt />
                    <span>Liste des Sessions</span>
                </h2>

                {error && (
                    <div className="session-alert error">
                        <FaInfoCircle />
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="session-loading-state">
                        <FaSpinner className="session-spinner" />
                        <p>Chargement des sessions...</p>
                    </div>
                ) : sessions.length > 0 ? (
                    <div className="sessions-grid">
                        {sessions.map((session) => (
                            <div className="session-card" key={session.id}>
                                <div className="session-card-content">
                                    <div className="session-date-section">
                                        <span className="session-date">
                                            {new Date(session.date).toLocaleDateString('fr-FR', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long'
                                            })}
                                        </span>
                                        <span className="session-year">
                                            {new Date(session.date).getFullYear()}
                                        </span>
                                    </div>

                                    <div className={getStatusBadgeClass(session.status)}>
                                        {session.status}
                                    </div>

                                    <button
                                        className="session-details-button"
                                        onClick={() => handleShowDetails(session)}
                                    >
                                        <span>Voir Détails</span>
                                        <FaArrowRight className="session-arrow-icon" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="session-empty">
                        <FaCalendarAlt />
                        <p>Aucune session disponible</p>
                    </div>
                )}

                {showModal && selectedSession && (
                    <div className="session-details-overlay">
                        <div className="session-details-container">
                            <div className="session-details-header">
                                <h3 className="session-details-title">
                                    <FaCalendarAlt />
                                    Détails de la session
                                </h3>
                            </div>
                            <div className="session-details-content">
                                <div className="session-details-main">
                                    <div className="session-details-row">
                                        <div className="session-details-field">
                                            <div className="session-details-icon">
                                                <FaCalendarAlt />
                                            </div>
                                            <div className="session-details-field-content">
                                                <span className="session-details-label">Date</span>
                                                <span className="session-details-value">
                                                    {new Date(selectedSession.date).toLocaleDateString('fr-FR', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`session-details-status ${selectedSession.status.toLowerCase()}`}>
                                            {selectedSession.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="session-details-section">
                                    <h4 className="session-details-section-title">
                                        <FaUser />
                                        Information du Bénévole
                                    </h4>
                                    {selectedSession.volunteer ? (
                                        <div className="session-details-grid">
                                            <div className="session-details-field">
                                                <div className="session-details-icon">
                                                    <FaUser />
                                                </div>
                                                <div className="session-details-field-content">
                                                    <span className="session-details-label">Nom d'utilisateur</span>
                                                    <span className="session-details-value">
                                                        {selectedSession.volunteer.username || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="session-details-field">
                                                <div className="session-details-icon">
                                                    <FaEnvelope />
                                                </div>
                                                <div className="session-details-field-content">
                                                    <span className="session-details-label">Email</span>
                                                    <span className="session-details-value">
                                                        {selectedSession.volunteer.email || 'Non fourni'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="session-details-field">
                                                <div className="session-details-icon">
                                                    <FaPhone />
                                                </div>
                                                <div className="session-details-field-content">
                                                    <span className="session-details-label">Téléphone</span>
                                                    <span className="session-details-value">
                                                        {selectedSession.volunteer.phoneNumber || 'Non fourni'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="session-details-empty">
                                            <p>Aucun bénévole assigné</p>
                                        </div>
                                    )}
                                </div>

                                <button className="session-details-close-btn" onClick={handleCloseModal}>
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

export default SessionListPage;
