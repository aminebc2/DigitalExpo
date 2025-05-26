import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';
import {
    FaUserClock,
    FaSpinner,
    FaCheck,
    FaTimes,
    FaExclamationCircle,
    FaUser,
    FaBuilding,
    FaClock,
    FaCog
} from 'react-icons/fa';
import './VolunteerRequests.css';

const VolunteerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionInProgress, setActionInProgress] = useState(false);

    useEffect(() => {
        fetchVolunteerRequests();
    }, []);

    const fetchVolunteerRequests = async () => {
        setLoading(true);
        try {
            const response = await AdminService.getAllRequests();
            if (response.statusCode === 200) {
                setRequests(response.data || []);
            } else {
                setError(response.message || 'Failed to fetch volunteer requests');
            }
        } catch (err) {
            setError('An error occurred while fetching volunteer requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (requestId, status) => {
        setActionInProgress(true);
        try {
            const response = await AdminService.updateRequestStatus(requestId, status);
            if (response.statusCode === 200) {
                await fetchVolunteerRequests();
            } else {
                setError(response.message || 'Failed to update request status');
            }
        } catch (err) {
            console.error('Error occurred while updating request status:', err);
            setError('An error occurred while updating the request status');
        } finally {
            setActionInProgress(false);
        }
    };

    if (loading && requests.length === 0) {
        return (
            <div className="volunteer-requests-loading">
                <div className="spinner" />
            </div>
        );
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'status-badge status-badge-approved';
            case 'REJECTED':
                return 'status-badge status-badge-rejected';
            default:
                return 'status-badge status-badge-pending';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return <FaCheck />;
            case 'REJECTED':
                return <FaTimes />;
            default:
                return <FaClock />;
        }
    };

    return (
        <div className="volunteer-requests">

            {error && (
                <div className="volunteer-requests-alert volunteer-requests-alert-error">
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            <div className="volunteer-requests-table-wrapper">
                <div className="volunteer-requests-table-container">
                    <table className="volunteer-requests-table">
                        <thead>
                        <tr>
                            <th><FaUser className="me-2" />Volunteer</th>
                            <th><FaBuilding className="me-2" />Association</th>
                            <th><FaClock className="me-2" />Status</th>
                            <th><FaCog className="me-2" />Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.volunteer?.username || 'N/A'}</td>
                                    <td>{request.association?.name || 'N/A'}</td>
                                    <td>
                                            <span className={getStatusBadgeClass(request.status)}>
                                                {getStatusIcon(request.status)}
                                                {request.status}
                                            </span>
                                    </td>
                                    <td>
                                        {request.status === 'PENDING' ? (
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-action btn-approve"
                                                    onClick={() => handleUpdateStatus(request.id, 'APPROVED')}
                                                    disabled={actionInProgress}
                                                >
                                                    <FaCheck />
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn-action btn-reject"
                                                    onClick={() => handleUpdateStatus(request.id, 'REJECTED')}
                                                    disabled={actionInProgress}
                                                >
                                                    <FaTimes />
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <select
                                                className="status-select"
                                                onChange={(e) => handleUpdateStatus(request.id, e.target.value)}
                                                value={request.status}
                                                disabled={actionInProgress}
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="APPROVED">Approved</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="volunteer-requests-empty">
                                    <FaUserClock />
                                    <p>No volunteer requests found</p>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VolunteerRequests;
