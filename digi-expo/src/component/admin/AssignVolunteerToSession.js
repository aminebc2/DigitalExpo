import React, { useEffect, useState } from 'react';
import AdminService from "../../service/AdminService";

const AssignVolunteerToSession = ({ sessionId, associationId, onClose }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('associationId:', associationId);  // Log the associationId to check if it's valid

        if (!associationId) {
            setError('No association ID provided');
            setLoading(false);
            return;
        }

        const fetchVolunteers = async () => {
            try {
                const response = await AdminService.getAssoVolunteers(associationId);
                console.log('API Response:', response); // Log the response to ensure it's as expected

                if (response && response.data) {
                    setVolunteers(response.data);  // Set volunteers if the response is correct
                } else {
                    setError('No data found for volunteers');
                }
            } catch (error) {
                console.error('Error fetching volunteers:', error);
                setError(error.message || 'Failed to load volunteers');
            }
            setLoading(false); // Stop loading once done
        };

        fetchVolunteers();
    }, [associationId]); // Ensure associationId is tracked




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

    if (loading) return <div>Loading volunteers...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <div className="mb-3">
                <label className="form-label">Select Volunteer</label>
                <select className="form-select" onChange={(e) => setSelectedVolunteerId(e.target.value)}>
                    <option value="">Choose one</option>
                    {volunteers.length > 0 ? (
                        volunteers.map((v) => (
                            <option key={v.id} value={v.id}>{v.username}</option>
                        ))
                    ) : (
                        <option disabled>No volunteers available</option>
                    )}
                </select>
            </div>
            <div className="d-flex justify-content-end">
                <button className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAssign}>Assign</button>
            </div>
        </div>
    );
};

export default AssignVolunteerToSession;
