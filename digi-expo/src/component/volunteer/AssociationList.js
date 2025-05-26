import React, { useEffect, useState } from 'react';
import VolunteerService from "../../service/VolunteerService";
import { FaBuilding, FaEnvelope, FaUserTie, FaPhone, FaHandshake, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import './AssociationList.css';

const AssociationList = () => {
    const [associations, setAssociations] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [joinedIds, setJoinedIds] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchAssociations = async () => {
            if (!volunteerId) {
                setError('Volunteer ID is missing. Please log in again.');
                return;
            }
            setError('');
            try {
                const response = await VolunteerService.getAllAssociations();
                if (response.status === 200) {
                    setAssociations(response.data.associationList || []);
                } else {
                    setError('Failed to load associations');
                }
            } catch (err) {
                console.error(err);
                setError('Network or server error while loading associations');
            }
        };

        fetchAssociations();
    }, [volunteerId]);

    const handleJoinAssociation = async (associationId) => {
        if (!volunteerId) {
            setError('You must be logged in to join an association.');
            return;
        }
        setLoadingId(associationId);
        setMessage('');
        setError('');
        try {
            const res = await VolunteerService.createRequest(volunteerId, associationId);
            setMessage(res.message || 'Request sent successfully.');
            setJoinedIds((prev) => [...prev, associationId]);
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to send request.';
            setError(errMsg);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="associations-page">
            <div className="associations-content">
                <h2 className="page-title">
                    <FaBuilding />
                    <span>Associations</span>
                </h2>

                {message && (
                    <div className="alert success">
                        <FaCheckCircle className="alert-icon" />
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div className="alert error">
                        <FaExclamationTriangle className="alert-icon" />
                        <span>{error}</span>
                    </div>
                )}

                {associations.length > 0 ? (
                    <div className="associations-grid">
                        {associations.map((assoc) => (
                            <div className="association-card" key={assoc.id}>
                                <div className="card-image">
                                    {assoc.imageFileName ? (
                                        <img
                                            src={`http://localhost:8080/images/${assoc.imageFileName}`}
                                            alt={`${assoc.name} logo`}
                                        />
                                    ) : (
                                        <div className="image-placeholder">
                                            <FaBuilding />
                                        </div>
                                    )}
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">{assoc.name}</h3>

                                    <div className="card-details">
                                        <div className="detail-row">
                                            <FaEnvelope className="detail-icon" />
                                            <div className="detail-content">
                                                <span className="detail-label">Email</span>
                                                <span className="detail-value">{assoc.email || 'No email provided'}</span>
                                            </div>
                                        </div>
                                        <div className="detail-row">
                                            <FaUserTie className="detail-icon" />
                                            <div className="detail-content">
                                                <span className="detail-label">Manager</span>
                                                <span className="detail-value">{assoc.responsableName || 'No manager name provided'}</span>
                                            </div>
                                        </div>
                                        <div className="detail-row">
                                            <FaPhone className="detail-icon" />
                                            <div className="detail-content">
                                                <span className="detail-label">Phone</span>
                                                <span className="detail-value">{assoc.responsablePhone || 'No phone provided'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className={`join-button ${joinedIds.includes(assoc.id) ? 'joined' : ''}`}
                                        onClick={() => handleJoinAssociation(assoc.id)}
                                        disabled={joinedIds.includes(assoc.id) || loadingId === assoc.id}
                                    >
                                        {loadingId === assoc.id ? (
                                            <>
                                                <FaSpinner className="spinner" />
                                                <span>Sending...</span>
                                            </>
                                        ) : joinedIds.includes(assoc.id) ? (
                                            <>
                                                <FaCheckCircle />
                                                <span>Request Sent</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaHandshake />
                                                <span>Join Association</span>
                                                <FaArrowRight className="arrow-icon" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-associations">
                        <FaBuilding className="empty-icon" />
                        <p>No associations found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssociationList;
