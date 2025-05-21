import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';

const VolunteerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionInProgress, setActionInProgress] = useState(false); // To handle action button disabling

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

            // Log the response to ensure we see it
            console.log('Update request status response:', response);

            if (response.statusCode === 200) {
                await fetchVolunteerRequests(); // Refresh the requests list
            } else {
                setError(response.message || 'Failed to update request status');
            }
        } catch (err) {
            // Log the error to get more details
            console.error('Error occurred while updating request status:', err);
            setError('An error occurred while updating the request status');
        } finally {
            setActionInProgress(false);
        }
    };


    if (loading && requests.length === 0) {
        return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
    }

    return (
        <div className="card">
            <div className="card-header">
                <h3>Volunteer Requests</h3>
            </div>
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Volunteer</th>
                            <th>Association</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.volunteer?.username || 'N/A'}</td>
                                    <td>{request.association?.name || 'N/A'}</td>
                                    <td>
                                            <span className={`badge ${request.status === 'APPROVED' ? 'bg-success' : request.status === 'REJECTED' ? 'bg-danger' : 'bg-warning'}`}>
                                                {request.status}
                                            </span>
                                    </td>
                                    <td>
                                        {request.status === 'PENDING' && (
                                            <>
                                                <button
                                                    className="btn btn-sm btn-success me-2"
                                                    onClick={() => handleUpdateStatus(request.id, 'APPROVED')}
                                                    disabled={actionInProgress || loading}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger me-2"
                                                    onClick={() => handleUpdateStatus(request.id, 'REJECTED')}
                                                    disabled={actionInProgress || loading}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {request.status !== 'PENDING' && (
                                            <select
                                                className="form-select form-select-sm"
                                                onChange={(e) => handleUpdateStatus(request.id, e.target.value)}
                                                value={request.status}
                                                disabled={actionInProgress || loading}
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
                                <td colSpan="6" className="text-center">No volunteer requests found</td>
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