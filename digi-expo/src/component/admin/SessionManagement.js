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
    FaUserPlus
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
                                                <FaEdit />
                                                Edit
                                            </button>

                                            {session.status === "CONFIRMED" && (
                                                <button
                                                    className="btn-action btn-assign"
                                                    onClick={() => handleOpenAssignModal(session)}
                                                >
                                                    <FaUserPlus />
                                                    Assign
                                                </button>
                                            )}
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
                <div className="session-modal-backdrop">
                    <div className="session-modal">
                        <div className="session-modal-header">
                            <h5 className="session-modal-title">Edit Session Status</h5>
                            <button className="session-modal-close" onClick={closeStatusModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSession}>
                            <div className="session-modal-body">
                                <div className="session-form-group">
                                    <label className="session-form-label">Status</label>
                                    <select
                                        className="session-form-select"
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
                            <div className="session-modal-footer">
                                <button type="button" className="btn-action" onClick={closeStatusModal}>
                                    <FaTimes />
                                    Close
                                </button>
                                <button type="submit" className="btn-action btn-edit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <FaSpinner className="spinner" />
                                            <span>Updating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck />
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
                <div className="session-modal-backdrop">
                    <div className="session-modal">
                        <div className="session-modal-header">
                            <h5 className="session-modal-title">
                                <FaUserPlus className="me-2" />
                                Assign Volunteer
                            </h5>
                            <button className="session-modal-close" onClick={closeAssignModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="session-modal-body">
                            <AssignVolunteerToSession
                                sessionId={selectedSession.id}
                                associationId={selectedSession.association?.id}
                                onClose={closeAssignModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionManagement;
