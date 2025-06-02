import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';
import AssignVolunteerToSession from '../admin/AssignVolunteerToSession';
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
                setError(response.message || 'Failed to fetch sessions');
            }
        } catch (err) {
            setError('An error occurred while fetching sessions');
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
            setError('Failed to fetch session details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSession = async (e) => {
        e.preventDefault();
        if (!selectedSessionId || !updatedStatus) {
            setError('Please select a status');
            return;
        }

        setLoading(true);
        try {
            const updatedSessionData = {
                status: updatedStatus,
                volunteer: (updatedStatus === 'CONFIRMED') ? selectedSession.volunteer : null
            };

            await AdminService.updateSession(selectedSessionId, updatedSessionData);
            setError('');
            setShowStatusModal(false);
            fetchSessions();
        } catch (err) {
            setError('An error occurred while updating the session');
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
            case 'CONFIRMED':
                return 'status-badge status-badge-confirmed';
            case 'CANCELED':
                return 'status-badge status-badge-canceled';
            default:
                return 'status-badge status-badge-pending';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return <FaCheck />;
            case 'CANCELED':
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
                await fetchSessions(); // Refresh the sessions list
                setError('');
            } else {
                setError(response.message || 'Failed to delete session');
            }
        } catch (err) {
            setError(err.message || 'Failed to delete session. Please check your permissions.');
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
                            <th><FaCalendarAlt className="me-2" />Date</th>
                            <th><FaBuilding className="me-2" />Association</th>
                            <th><FaUser className="me-2" />Volunteer</th>
                            <th><FaClock className="me-2" />Status</th>
                            <th><FaCog className="me-2" />Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sessions.length > 0 ? (
                            sessions.map((session) => (
                                <tr key={session.id}>
                                    <td>{new Date(session.date).toLocaleDateString()}</td>
                                    <td>{session.association?.name || 'N/A'}</td>
                                    <td>
                                        {session.status === 'CONFIRMED' && session.volunteer
                                            ? session.volunteer.username
                                            : 'N/A'}
                                    </td>
                                    <td>
                                            <span className={getStatusBadgeClass(session.status)}>
                                                {getStatusIcon(session.status)}
                                                {session.status}
                                            </span>
                                    </td>
                                    <td>
                                        <div className="session-actions">
                                            <button
                                                className="btn-action btn-edit"
                                                onClick={() => handleSessionClick(session.id)}
                                            >
                                                <FaEdit/>
                                                Edit
                                            </button>

                                            {session.status === "CONFIRMED" && (
                                                <button
                                                    className="btn-action btn-assign"
                                                    onClick={() => handleOpenAssignModal(session)}
                                                >
                                                    <FaUserPlus/>
                                                    Assign
                                                </button>
                                            )}

                                            <button
                                                className="btn-action btn-delete"
                                                onClick={() => handleDeleteClick(session)}
                                            >
                                                <FaTrash/>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="session-empty">
                                    <FaCalendarAlt />
                                    <p>No sessions found</p>
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
                                Edit Session Status
                            </h5>
                            <button className="manage-modal__close" onClick={closeStatusModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSession}>
                            <div className="manage-modal__content">
                                <div className="manage-form__group">
                                    <label className="manage-form__label">Status</label>
                                    <select
                                        className="manage-form__select"
                                        value={updatedStatus}
                                        onChange={(e) => setUpdatedStatus(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="CONFIRMED">Confirmed</option>
                                        <option value="CANCELED">Canceled</option>
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
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="manage-btn manage-btn--primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="manage-spinner" />
                                            <span>Updating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck className="manage-btn__icon" />
                                            <span>Update Status</span>
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
                                Assign Volunteer
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
                                Delete Session
                            </h5>
                            <button className="manage-modal__close" onClick={closeDeleteModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="manage-modal__content">
                            <p>Are you sure you want to delete this session? This action cannot be undone.</p>
                            <div className="session-details">
                                <p><strong>Date:</strong> {new Date(selectedSession.date).toLocaleDateString()}</p>
                                <p><strong>Association:</strong> {selectedSession.association?.name || 'N/A'}</p>
                                <p><strong>Status:</strong> {selectedSession.status}</p>
                            </div>
                        </div>
                        <div className="manage-modal__footer">
                            <button
                                type="button"
                                className="manage-btn manage-btn--secondary"
                                onClick={closeDeleteModal}
                            >
                                <FaTimes className="manage-btn__icon" />
                                Cancel
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
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="manage-btn__icon" />
                                        <span>Delete Session</span>
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

