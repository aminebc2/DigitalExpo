import React, { useState, useEffect } from 'react';
import AssociationService from '../../service/AssociationService';

const VolunteerListPage = ({ associationId }) => {
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const data = await AssociationService.getVolunteers(associationId);
                setVolunteers(data);
            } catch (error) {
                console.error('Error fetching volunteers:', error);
            }
        };

        fetchVolunteers();
    }, [associationId]);

    return (
        <div className="container mt-4">
            <h3>Liste des Bénévoles</h3>
            {volunteers.length > 0 ? (
                <ul className="list-group">
                    {volunteers.map((volunteer) => (
                        <li className="list-group-item" key={volunteer.id}>
                            <p><strong>Nom:</strong> {volunteer.name}</p>
                            <p><strong>Email:</strong> {volunteer.email}</p>
                            <p><strong>Téléphone:</strong> {volunteer.phone}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun bénévole disponible.</p>
            )}
        </div>
    );
};

export default VolunteerListPage;
