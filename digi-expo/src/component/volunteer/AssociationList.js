import React, { useEffect, useState } from 'react';
import VolunteerService from "../../service/VolunteerService";
import './AssociationList.css';

const AssociationList = () => {
    const [associations, setAssociations] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [joinedIds, setJoinedIds] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    // Get volunteerId from logged-in user stored in localStorage
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
                    // Adjust based on actual response structure
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
        <div className="association-list-container">
            <h2 className="mb-4">Associations</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {associations.length > 0 ? (
                <div className="row">
                    {associations.map((assoc) => (
                        <div className="col-md-4" key={assoc.id}>
                            <div className="card association-card mb-4">
                                {assoc.imageFileName ? (
                                    <img
                                        src={`http://localhost:8080/images/${assoc.imageFileName}`}
                                        alt={`${assoc.name} logo`}
                                        className="card-img-top association-image"
                                    />
                                ) : (
                                    <div className="no-image-placeholder"></div>
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{assoc.name}</h5>
                                    <p className="card-text"><strong>Email:</strong> {assoc.email}</p>
                                    <p className="card-text"><strong>Responsable Name:</strong> {assoc.responsableName}</p>
                                    <p className="card-text"><strong>Responsable Phone:</strong> {assoc.responsablePhone}</p>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleJoinAssociation(assoc.id)}
                                        disabled={joinedIds.includes(assoc.id) || loadingId === assoc.id}
                                    >
                                        {joinedIds.includes(assoc.id)
                                            ? "Request Sent"
                                            : loadingId === assoc.id
                                                ? "Sending..."
                                                : "Join Association"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-association-text">No associations found.</p>
            )}
        </div>
    );
};

export default AssociationList;
