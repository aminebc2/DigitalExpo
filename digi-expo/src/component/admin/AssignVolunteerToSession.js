import React, { useEffect, useState } from 'react';
import AdminService from "../../service/AdminService";

const AssignVolunteerToSession = ({ sessionId, associationId, onClose }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!associationId) {
            setError('No association ID provided');
            setLoading(false);
            return;
        }

        const fetchVolunteers = async () => {
            try {
                const response = await AdminService.getAssoVolunteers(associationId);
                console.log('API Response:', response);

                const volunteerArray = Array.isArray(response) ? response :
                    response?.volunteerList && Array.isArray(response.volunteerList) ? response.volunteerList :
                        [];

                const processedVolunteers = Array.from(new Map(volunteerArray.map(v => [v.id, v])).values());
                if (processedVolunteers.length > 0) {
                    setVolunteers(processedVolunteers);
                } else {
                    setError('No volunteers found for this association');
                }
            } catch (error) {
                setError(error.message || 'Failed to load volunteers');
            }
            setLoading(false);
        };

        fetchVolunteers();
    }, [associationId]);

    const handleAssign = async () => {
        if (!selectedVolunteerId) {
            setError("Please select a volunteer");
            return;
        }

        try {
            await AdminService.assignVolunteerToSession(sessionId, selectedVolunteerId);
            onClose(); // Close modal after assignment
        } catch (err) {
            setError("Failed to assign volunteer. Please try again.");
            console.error('Error assigning volunteer:', err);
        }
    };

    if (loading) return <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>;

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label className="form-label">Select Volunteer</label>
                <select
                    className="form-select"
                    onChange={(e) => setSelectedVolunteerId(e.target.value)}
                    value={selectedVolunteerId}
                >
                    <option value="">Choose one</option>
                    {volunteers.map((volunteer, index) => {
                        // Use both volunteer.id and index to ensure a unique key
                        const key = `volunteer-${volunteer.id}-${index}`;

                        // Use the volunteer ID for the value
                        const value = volunteer.id || '';

                        // Use the username for display
                        const displayName = volunteer.username || 'Unknown volunteer';

                        return (
                            <option key={key} value={value}>
                                {displayName} (#{index + 1})
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className="d-flex justify-content-end">
                <button className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
                <button
                    className="btn btn-primary"
                    onClick={handleAssign}
                    disabled={!selectedVolunteerId}
                >
                    Assign
                </button>
            </div>
        </div>
    );
};

export default AssignVolunteerToSession;