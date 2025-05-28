import React, { useEffect, useState } from 'react';
import AdminService from "../../service/AdminService";
import { FaSpinner, FaExclamationCircle, FaTimes, FaCheck } from 'react-icons/fa';
import './AssignVolunteerToSession.css';

const AssignVolunteerToSession = ({ sessionId, associationId, onClose }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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

        setSubmitting(true);
        try {
            await AdminService.assignVolunteerToSession(sessionId, selectedVolunteerId);
            onClose();
        } catch (err) {
            setError("Failed to assign volunteer. Please try again.");
            console.error('Error assigning volunteer:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="assign-volunteer__loading">
                <FaSpinner className="assign-volunteer__spinner" />
            </div>
        );
    }

    return (
        <div className="assign-volunteer">
            {error && (
                <div className="assign-volunteer__error">
                    <FaExclamationCircle className="assign-volunteer__error-icon" />
                    <span>{error}</span>
                </div>
            )}

            <div className="assign-volunteer__form-group">
                <label className="assign-volunteer__label">Select Volunteer</label>
                <select
                    className="assign-volunteer__select"
                    onChange={(e) => setSelectedVolunteerId(e.target.value)}
                    value={selectedVolunteerId}
                    disabled={volunteers.length === 0}
                >
                    <option value="">Choose a volunteer</option>
                    {volunteers.map((volunteer, index) => (
                        <option
                            key={`volunteer-${volunteer.id}-${index}`}
                            value={volunteer.id || ''}
                        >
                            {volunteer.username || 'Unknown volunteer'} (#{index + 1})
                        </option>
                    ))}
                </select>
            </div>

            <div className="assign-volunteer__actions">
                <button
                    className="manage-btn manage-btn--secondary"
                    onClick={onClose}
                    type="button"
                >
                    <FaTimes className="manage-btn__icon" />
                    Cancel
                </button>
                <button
                    className="manage-btn manage-btn--primary"
                    onClick={handleAssign}
                    disabled={!selectedVolunteerId || submitting}
                    type="button"
                >
                    {submitting ? (
                        <>
                            <FaSpinner className="manage-spinner" />
                            <span>Assigning...</span>
                        </>
                    ) : (
                        <>
                            <FaCheck className="manage-btn__icon" />
                            <span>Assign Volunteer</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AssignVolunteerToSession;
