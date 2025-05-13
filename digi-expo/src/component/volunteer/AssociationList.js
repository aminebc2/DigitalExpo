import React, { useEffect, useState } from 'react';
import VolunteerService from "../../service/VolunteerService";
import './AssociationList.css';

const AssociationList = () => {
    const [associations, setAssociations] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssociations = async () => {
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
    }, []);


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
                                    <p className="card-text"><strong>Responsable Phone Number:</strong> {assoc.responsablePhone}</p>
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
