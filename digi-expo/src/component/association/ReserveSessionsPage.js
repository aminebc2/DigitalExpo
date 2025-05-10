import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AssociationService from '../../service/AssociationService';
import { AuthContext } from '../../context/AuthContext'; // Assuming you're using context for user data


const ReserveSessionsPage = () => {
    const { id: associationId } = useParams();
    const { currentUser } = useContext(AuthContext); // Assuming `AuthContext` holds currentUser data
    const [dates, setDates] = useState(['']);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (currentUser?.role === 'ASSOCIATION' && currentUser.id) {
            localStorage.setItem('associationId', currentUser.id);
        }
    }, [currentUser]);

    // Date input change handler
    const handleDateChange = (index, value) => {
        const updatedDates = [...dates];
        updatedDates[index] = value;
        setDates(updatedDates);
    };

    // Add more date input field
    const addDateInput = () => setDates([...dates, '']);

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if associationId is available
        if (!associationId) {
            setMessage('Identifiant de l’association manquant.');
            return;
        }

        // Prepare DTO for the API call
        const dto = { dates };

        try {
            // Call the backend service to reserve sessions
            await AssociationService.reserveSessions(associationId, dto);
            setMessage('Sessions réservées avec succès.');
        } catch (error) {
            console.error("Reservation failed:", error);
            setMessage('Erreur lors de la réservation.');
        }
    };

    return (
        <div className="container mt-4">
            <h3>Réserver des Sessions</h3>
            <form onSubmit={handleSubmit}>
                {dates.map((date, index) => (
                    <input
                        key={index}
                        type="date"
                        className="form-control mb-2"
                        value={date}
                        onChange={(e) => handleDateChange(index, e.target.value)}
                        required
                    />
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addDateInput}>
                    + Ajouter une autre date
                </button>
                <br />
                <button type="submit" className="btn btn-primary">Réserver</button>
            </form>
            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
};

export default ReserveSessionsPage;
