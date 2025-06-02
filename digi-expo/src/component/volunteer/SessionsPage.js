import React, { useState, useEffect } from 'react';
import VolunteerService from '../../service/VolunteerService';
import { useLanguage } from '../../context/LanguageContext';
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

// Translations object
const translations = {
    fr: {
        pageTitle: "Mes Sessions Assignées",
        noSessions: "Aucune session assignée.",
        viewDetails: "Voir Détails",
        sessionDetails: "Détails de la session",
        close: "Fermer",
        date: "Date",
        associationInfo: "Information de l'Association",
        association: "Association",
        email: "Email",
        manager: "Responsable",
        phone: "Téléphone",
        notAvailable: "N/A",
        status: {
            pending: "En attente",
            confirmed: "Confirmed",
            cancelled: "Annulé",
            completed: "Terminé"
        }
    },
    en: {
        pageTitle: "My Assigned Sessions",
        noSessions: "No assigned sessions.",
        viewDetails: "View Details",
        sessionDetails: "Session Details",
        close: "Close",
        date: "Date",
        associationInfo: "Association Information",
        association: "Association",
        email: "Email",
        manager: "Manager",
        phone: "Phone",
        notAvailable: "N/A",
        status: {
            pending: "Pending",
            confirmed: "Confirmed",
            cancelled: "Cancelled",
            completed: "Completed"
        }
    }
};

const SessionPage = () => {
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const { language } = useLanguage();
    const t = translations[language];

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await VolunteerService.getSessions(volunteerId);
                const sessionsList = response?.data || [];

                if (Array.isArray(sessionsList)) {
                    // Translate status for each session
                    const translatedSessions = sessionsList.map(session => ({
                        ...session,
                        status: t.status[session.status?.toLowerCase()] || session.status
                    }));
                    setSessions(translatedSessions);
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
    }, [volunteerId, language]); // Add language dependency to update translations when language changes

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
                        <span>{t.pageTitle}</span>
                    </h2>
                </div>

                {error && (
                    <div className="alert-box">
                        <FaInfoCircle />
                        <span>{error}</span>
                    </div>
                )}

                {sessions.length > 0 ? (
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
                                        <span>{t.viewDetails}</span>
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FaCalendarAlt />
                        <p>{t.noSessions}</p>
                    </div>
                )}

                {showModal && selectedSession && (
                    <div className="detail-overlay">
                        <div className="detail-container">
                            <div className="detail-header">
                                <h3 className="detail-title">
                                    <FaCalendarAlt />
                                    {t.sessionDetails}
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
                                                <span className="detail-label">{t.date}</span>
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
                                        {t.associationInfo}
                                    </h4>
                                    <div className="association-grid">
                                        <div className="detail-field">
                                            <div className="detail-icon">
                                                <FaBuilding />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">{t.association}</span>
                                                <span className="detail-value">
                                                    {selectedSession.association?.name || t.notAvailable}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="detail-field">
                                            <div className="detail-icon">
                                                <FaEnvelope />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">{t.email}</span>
                                                <span className="detail-value">
                                                    {selectedSession.association?.email || t.notAvailable}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="detail-field">
                                            <div className="detail-icon">
                                                <FaUserTie />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">{t.manager}</span>
                                                <span className="detail-value">
                                                    {selectedSession.association?.responsableName || t.notAvailable}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="detail-field">
                                            <div className="detail-icon">
                                                <FaPhone />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">{t.phone}</span>
                                                <span className="detail-value">
                                                    {selectedSession.association?.responsablePhone || t.notAvailable}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="detail-action" onClick={handleCloseModal}>
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

export default SessionPage;
