import React, { useState, useEffect } from 'react';
import AssociationService from '../../service/AssociationService';
import { FaCalendarAlt, FaInfoCircle, FaSpinner, FaTimes, FaArrowRight, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import './SessionListPage.css';

// Translations object
const translations = {
    fr: {
        pageTitle: "Liste des Sessions",
        loading: "Chargement des sessions...",
        error: "Erreur lors du chargement des sessions",
        noSessions: "Aucune session disponible",
        viewDetails: "Voir Détails",
        sessionDetails: "Détails de la session",
        date: "Date",
        volunteerInfo: "Information du Bénévole",
        username: "Nom d'utilisateur",
        email: "Email",
        phone: "Téléphone",
        notProvided: "Non fourni",
        noVolunteer: "Aucun bénévole assigné",
        close: "Fermer",
        status: {
            pending: "En attente",
            confirmed: "Confirmé",
            cancelled: "Annulé",
            completed: "Terminé"
        }
    },
    en: {
        pageTitle: "Sessions List",
        loading: "Loading sessions...",
        error: "Error loading sessions",
        noSessions: "No sessions available",
        viewDetails: "View Details",
        sessionDetails: "Session Details",
        date: "Date",
        volunteerInfo: "Volunteer Information",
        username: "Username",
        email: "Email",
        phone: "Phone",
        notProvided: "Not provided",
        noVolunteer: "No volunteer assigned",
        close: "Close",
        status: {
            pending: "Pending",
            confirmed: "Confirmed",
            cancelled: "Cancelled",
            completed: "Completed"
        }
    }
};

const SessionListPage = () => {
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const { language } = useLanguage();
    const t = translations[language];

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
                setError(t.error);
                setSessions([]);
                setLoading(false);
            }
        };

        if (associationId) fetchSessions();
    }, [associationId, t.error]);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }).format(date);
    };

    const formatFullDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const getTranslatedStatus = (status) => {
        const statusKey = status?.toLowerCase();
        return t.status[statusKey] || status;
    };

    return (
        <div className="sessions-page">
            <div className="sessions-content">
                <h2 className="page-title">
                    <FaCalendarAlt />
                    <span>{t.pageTitle}</span>
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
                        <p>{t.loading}</p>
                    </div>
                ) : sessions.length > 0 ? (
                    <div className="sessions-grid">
                        {sessions.map((session) => (
                            <div className="session-card" key={session.id}>
                                <div className="session-card-content">
                                    <div className="session-date-section">
                                        <span className="session-date">
                                            {formatDate(session.date)}
                                        </span>
                                        <span className="session-year">
                                            {new Date(session.date).getFullYear()}
                                        </span>
                                    </div>

                                    <div className={getStatusBadgeClass(session.status)}>
                                        {getTranslatedStatus(session.status)}
                                    </div>

                                    <button
                                        className="session-details-button"
                                        onClick={() => handleShowDetails(session)}
                                    >
                                        <span>{t.viewDetails}</span>
                                        <FaArrowRight className="session-arrow-icon" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="session-empty">
                        <FaCalendarAlt />
                        <p>{t.noSessions}</p>
                    </div>
                )}

                {showModal && selectedSession && (
                    <div className="session-details-overlay">
                        <div className="session-details-container">
                            <div className="session-details-header">
                                <h3 className="session-details-title">
                                    <FaCalendarAlt />
                                    {t.sessionDetails}
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
                                                <span className="session-details-label">{t.date}</span>
                                                <span className="session-details-value">
                                                    {formatFullDate(selectedSession.date)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`session-details-status ${selectedSession.status.toLowerCase()}`}>
                                            {getTranslatedStatus(selectedSession.status)}
                                        </div>
                                    </div>
                                </div>

                                <div className="session-details-section">
                                    <h4 className="session-details-section-title">
                                        <FaUser />
                                        {t.volunteerInfo}
                                    </h4>
                                    {selectedSession.volunteer ? (
                                        <div className="session-details-grid">
                                            <div className="session-details-field">
                                                <div className="session-details-icon">
                                                    <FaUser />
                                                </div>
                                                <div className="session-details-field-content">
                                                    <span className="session-details-label">{t.username}</span>
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
                                                    <span className="session-details-label">{t.email}</span>
                                                    <span className="session-details-value">
                                                        {selectedSession.volunteer.email || t.notProvided}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="session-details-field">
                                                <div className="session-details-icon">
                                                    <FaPhone />
                                                </div>
                                                <div className="session-details-field-content">
                                                    <span className="session-details-label">{t.phone}</span>
                                                    <span className="session-details-value">
                                                        {selectedSession.volunteer.phoneNumber || t.notProvided}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="session-details-empty">
                                            <p>{t.noVolunteer}</p>
                                        </div>
                                    )}
                                </div>

                                <button className="session-details-close-btn" onClick={handleCloseModal}>
                                    <FaTimes />
                                    {t.close}
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
