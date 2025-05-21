import React, { useEffect, useState } from 'react';
import VolunteerService from "../../service/VolunteerService";
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
                setMessage('Volunteer ID is missing. Please log in again.');
                return;
            }
            try {
                const response = await VolunteerService.getAllAssociations();
                if (response.status === 200) {
                    setAssociations(response.data.associationList || []);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load associations');
            }
        };

        fetchAssociations();
    }, [volunteerId]);

    const handleJoinAssociation = async (associationId) => {
        setLoadingId(associationId);
        try {
            console.log("volunteerId:", volunteerId, "associationId:", associationId);
            const res = await VolunteerService.createRequest(volunteerId, associationId);
            setMessage(res.message);
            setJoinedIds([...joinedIds, associationId]);
        } catch (error) {
            const errMsg = error.response?.data?.message || "Failed to send request.";
            setMessage(errMsg);
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