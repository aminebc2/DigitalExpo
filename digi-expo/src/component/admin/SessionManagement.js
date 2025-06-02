import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';
import AssignVolunteerToSession from '../admin/AssignVolunteerToSession';
import { useLanguage } from '../../context/LanguageContext';
import {
    FaCalendarAlt,
    FaSpinner,
    FaCheck,
    FaTimes,
    FaExclamationCircle,
    FaUser,
    FaBuilding,
    FaClock,
    FaCog,
    FaEdit,
    FaUserPlus,
    FaTrash
} from 'react-icons/fa';
import './SessionManagement.css';

// Translations object
const translations = {
    fr: {
        loading: "Chargement...",
        fetchError: "Une erreur s'est produite lors du chargement des sessions",
        fetchSessionError: "Échec du chargement des détails de la session",
        updateError: "Une erreur s'est produite lors de la mise à jour de la session",
        selectStatus: "Veuillez sélectionner un statut",
        deleteError: "Échec de la suppression de la session. Veuillez vérifier vos autorisations.",
        noSessions: "Aucune session trouvée",
        notAvailable: "N/A",
        table: {
            date: "Date",
            association: "Association",
            volunteer: "Bénévole",
            status: "Statut",
            actions: "Actions"
        },
        status: {
            pending: "PENDING",
            confirmed: "CONFIRMED",
            canceled: "CANCELED"
        },
        statusDisplay: {
            PENDING: "EN ATTENTE",
            CONFIRMED: "CONFIRMÉ",
            CANCELED: "ANNULÉ"
        },
        buttons: {
            edit: "Modifier",
            assign: "Assigner",
            delete: "Supprimer",
            cancel: "Annuler",
            update: "Mettre à jour",
            confirm: "Confirmer"
        },
        modals: {
            editStatus: {
                title: "Modifier le Statut de la Session",
                label: "Statut",
                selectPlaceholder: "Sélectionner un Statut",
                updating: "Mise à jour...",
                updateStatus: "Mettre à jour le Statut"
            },
            assignVolunteer: {
                title: "Assigner un Bénévole"
            },
            deleteSession: {
                title: "Supprimer la Session",
                confirmation: "Êtes-vous sûr de vouloir supprimer cette session ? Cette action ne peut pas être annulée.",
                details: {
                    date: "Date",
                    association: "Association",
                    status: "Statut"
                },
                deleting: "Suppression..."
            }
        }
    },
    en: {
        loading: "Loading...",
        fetchError: "An error occurred while fetching sessions",
        fetchSessionError: "Failed to fetch session details",
        updateError: "An error occurred while updating the session",
        selectStatus: "Please select a status",
        deleteError: "Failed to delete session. Please check your permissions.",
        noSessions: "No sessions found",
        notAvailable: "N/A",
        table: {
            date: "Date",
            association: "Association",
            volunteer: "Volunteer",
            status: "Status",
            actions: "Actions"
        },
        status: {
            pending: "PENDING",
            confirmed: "CONFIRMED",
            canceled: "CANCELED"
        },
        statusDisplay: {
            PENDING: "PENDING",
            CONFIRMED: "CONFIRMED",
            CANCELED: "CANCELED"
        },
        buttons: {
            edit: "Edit",
            assign: "Assign",
            delete: "Delete",
            cancel: "Cancel",
            update: "Update",
            confirm: "Confirm"
        },
        modals: {
            editStatus: {
                title: "Edit Session Status",
                label: "Status",
                selectPlaceholder: "Select Status",
                updating: "Updating...",
                updateStatus: "Update Status"
            },
            assignVolunteer: {
                title: "Assign Volunteer"
            },
            deleteSession: {
                title: "Delete Session",
                confirmation: "Are you sure you want to delete this session? This action cannot be undone.",
                details: {
                    date: "Date",
                    association: "Association",
                    status: "Status"
                },
                deleting: "Deleting..."
            }
        }
    }
};

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const { language } = useLanguage();
    const t = translations[language];

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await AdminService.getAllSessions();
            if (response.statusCode === 200) {
                setSessions(response.data);
            } else {
                setError(response.message || t.fetchError);
            }
        } catch (err) {
            setError(t.fetchError);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSessionClick = async (sessionId) => {
        setLoading(true);
        try {
            const session = await AdminService.getSessionById(sessionId);
            setSelectedSession(session);
            setSelectedSessionId(sessionId);
            setUpdatedStatus(session.status);
            setShowStatusModal(true);
        } catch (err) {
            setError(t.fetchSessionError);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSession = async (e) => {
        e.preventDefault();
        if (!selectedSessionId || !updatedStatus) {
            setError(t.selectStatus);
            return;
        }

        setLoading(true);
        try {
            const updatedSessionData = {
                status: updatedStatus,
                volunteer: (updatedStatus === t.status.confirmed) ? selectedSession.volunteer : null
            };

            await AdminService.updateSession(selectedSessionId, updatedSessionData);
            setError('');
            setShowStatusModal(false);
            fetchSessions();
        } catch (err) {
            setError(t.updateError);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const closeStatusModal = () => {
        setShowStatusModal(false);
        setSelectedSession(null);
    };

    const handleOpenAssignModal = (session) => {
        setSelectedSession(session);
        setShowAssignModal(true);
    };

    const closeAssignModal = () => {
        setShowAssignModal(false);
        setSelectedSession(null);
        fetchSessions();
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case t.status.confirmed:
                return 'status-badge status-badge-confirmed';
            case t.status.canceled:
                return 'status-badge status-badge-canceled';
            default:
                return 'status-badge status-badge-pending';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case t.status.confirmed:
                return <FaCheck />;
            case t.status.canceled:
                return <FaTimes />;
            default:
                return <FaClock />;
        }
    };

    const handleDeleteClick = (session) => {
        setSelectedSession(session);
        setShowDeleteConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            const response = await AdminService.deleteSession(selectedSession.id);
            if (response.statusCode === 200) {
                setShowDeleteConfirmModal(false);
                setSelectedSession(null);
                await fetchSessions();
                setError('');
            } else {
                setError(response.message || t.deleteError);
            }
        } catch (err) {
            setError(err.message || t.deleteError);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const closeDeleteModal = () => {
        setShowDeleteConfirmModal(false);
        setSelectedSession(null);
    };

    if (loading && sessions.length === 0) {
        return (
            <div className="session-loading">
                <div className="spinner" />
                <p>{t.loading}</p>
            </div>
        );
    }

    return (
        <div className="session-management">
            {error && (
                <div className="session-alert session-alert-error">
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            <div className="session-table-wrapper">
                <div className="session-table-container">
                    <table className="session-table">
                        <thead>
                        <tr>
                            <th><FaCalendarAlt className="me-2" />{t.table.date}</th>
                            <th><FaBuilding className="me-2" />{t.table.association}</th>
                            <th><FaUser className="me-2" />{t.table.volunteer}</th>
                            <th><FaClock className="me-2" />{t.table.status}</th>
                            <th><FaCog className="me-2" />{t.table.actions}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sessions.length > 0 ? (
                            sessions.map((session) => (
                                <tr key={session.id}>
                                    <td>{new Date(session.date).toLocaleDateString(language)}</td>
                                    <td>{session.association?.name || t.notAvailable}</td>
                                    <td>
                                        {session.status === t.status.confirmed && session.volunteer
                                            ? session.volunteer.username
                                            : t.notAvailable}
                                    </td>
                                    <td>
                                        <span className={getStatusBadgeClass(session.status)}>
                                            {getStatusIcon(session.status)}
                                            {t.statusDisplay[session.status]}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="session-actions">
                                            <button
                                                className="btn-action btn-edit"
                                                onClick={() => handleSessionClick(session.id)}
                                            >
                                                <FaEdit/>
                                                {t.buttons.edit}
                                            </button>

                                            {session.status === t.status.confirmed && (
                                                <button
                                                    className="btn-action btn-assign"
                                                    onClick={() => handleOpenAssignModal(session)}
                                                >
                                                    <FaUserPlus/>
                                                    {t.buttons.assign}
                                                </button>
                                            )}

                                            <button
                                                className="btn-action btn-delete"
                                                onClick={() => handleDeleteClick(session)}
                                            >
                                                <FaTrash/>
                                                {t.buttons.delete}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="session-empty">
                                    <FaCalendarAlt />
                                    <p>{t.noSessions}</p>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Status Modal */}
            {showStatusModal && selectedSession && (
                <div className="manage-modal__overlay">
                    <div className="manage-modal__container">
                        <div className="manage-modal__header">
                            <h5 className="manage-modal__title">
                                <FaCog className="manage-modal__title-icon" />
                                {t.modals.editStatus.title}
                            </h5>
                            <button className="manage-modal__close" onClick={closeStatusModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSession}>
                            <div className="manage-modal__content">
                                <div className="manage-form__group">
                                    <label className="manage-form__label">{t.modals.editStatus.label}</label>
                                    <select
                                        className="manage-form__select"
                                        value={updatedStatus}
                                        onChange={(e) => setUpdatedStatus(e.target.value)}
                                        required
                                    >
                                        <option value="">{t.modals.editStatus.selectPlaceholder}</option>
                                        <option value="PENDING">{t.statusDisplay.PENDING}</option>
                                        <option value="CONFIRMED">{t.statusDisplay.CONFIRMED}</option>
                                        <option value="CANCELED">{t.statusDisplay.CANCELED}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="manage-modal__footer">
                                <button
                                    type="button"
                                    className="manage-btn manage-btn--secondary"
                                    onClick={closeStatusModal}
                                >
                                    <FaTimes className="manage-btn__icon" />
                                    {t.buttons.cancel}
                                </button>
                                <button
                                    type="submit"
                                    className="manage-btn manage-btn--primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="manage-spinner" />
                                            <span>{t.modals.editStatus.updating}</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck className="manage-btn__icon" />
                                            <span>{t.modals.editStatus.updateStatus}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Volunteer Modal */}
            {showAssignModal && selectedSession && (
                <div className="manage-modal__overlay">
                    <div className="manage-modal__container">
                        <div className="manage-modal__header">
                            <h5 className="manage-modal__title">
                                <FaUserPlus className="manage-modal__title-icon" />
                                {t.modals.assignVolunteer.title}
                            </h5>
                            <button className="manage-modal__close" onClick={closeAssignModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="manage-modal__content">
                            <AssignVolunteerToSession
                                sessionId={selectedSession.id}
                                associationId={selectedSession.association?.id}
                                onClose={closeAssignModal}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmModal && selectedSession && (
                <div className="manage-modal__overlay">
                    <div className="manage-modal__container">
                        <div className="manage-modal__header">
                            <h5 className="manage-modal__title">
                                <FaTrash className="manage-modal__title-icon" />
                                {t.modals.deleteSession.title}
                            </h5>
                            <button className="manage-modal__close" onClick={closeDeleteModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="manage-modal__content">
                            <p>{t.modals.deleteSession.confirmation}</p>
                            <div className="session-details">
                                <p><strong>{t.modals.deleteSession.details.date}:</strong> {new Date(selectedSession.date).toLocaleDateString(language)}</p>
                                <p><strong>{t.modals.deleteSession.details.association}:</strong> {selectedSession.association?.name || t.notAvailable}</p>
                                <p><strong>{t.modals.deleteSession.details.status}:</strong> {selectedSession.status}</p>
                            </div>
                        </div>
                        <div className="manage-modal__footer">
                            <button
                                type="button"
                                className="manage-btn manage-btn--secondary"
                                onClick={closeDeleteModal}
                            >
                                <FaTimes className="manage-btn__icon" />
                                {t.buttons.cancel}
                            </button>
                            <button
                                type="button"
                                className="manage-btn manage-btn--danger"
                                onClick={handleDeleteConfirm}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="manage-spinner" />
                                        <span>{t.modals.deleteSession.deleting}</span>
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="manage-btn__icon" />
                                        <span>{t.buttons.delete}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionManagement;
