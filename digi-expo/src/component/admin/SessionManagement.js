import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';
import AssignVolunteerToSession from '../admin/AssignVolunteerToSession';

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
        if (!session.association) {
            // Show a default message or allow the user to assign an association.
            setSelectedSession(session);
            setShowAssignModal(true);
        } else {
            setSelectedSession(session);
            setShowAssignModal(true);
        }
    };


    const closeAssignModal = () => {
        setShowAssignModal(false);
        setSelectedSession(null);
        fetchSessions();
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3>Session Management</h3>
            </div>
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Association</th>
                            <th>Volunteer</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sessions.length > 0 ? (
                            sessions.map((session) => (
                                <tr key={session.id}>
                                    <td>{session.id}</td>
                                    <td>{new Date(session.date).toLocaleDateString()}</td>
                                    <td>{session.association?.name || 'N/A'}</td>
                                    <td>
                                        {session.status === 'CONFIRMED' && session.volunteer
                                            ? session.volunteer.username
                                            : 'N/A'}
                                    </td>
                                    <td>{session.status}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => handleSessionClick(session.id)}
                                        >
                                            Edit
                                        </button>

                                        {session.status === "CONFIRMED" && (
                                            <button
                                                className="btn btn-sm btn-success ms-2"
                                                onClick={() => handleOpenAssignModal(session)}
                                            >
                                                Assign Volunteer
                                            </button>
                                        )}
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No sessions found</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Edit Status Modal */}
                {showStatusModal && selectedSession && (
                    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Session Status</h5>
                                    <button className="btn-close" onClick={closeStatusModal}></button>
                                </div>
                                <form onSubmit={handleUpdateSession}>
                                    <div className="modal-body">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-select"
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
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={closeStatusModal}>
                                            Close
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? 'Updating...' : 'Update Status'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Assign Volunteer Modal */}
                {showAssignModal && selectedSession && (
                    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Assign Volunteer</h5>
                                    <button className="btn-close" onClick={closeAssignModal}></button>
                                </div>
                                <div className="modal-body">
                                    <AssignVolunteerToSession
                                        sessionId={selectedSession.id}
                                        associationId={selectedSession.association?.id}
                                        onClose={closeAssignModal}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

};

export default SessionManagement;
