import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AssociationService from '../../service/AssociationService';
import { AuthContext } from '../../context/AuthContext';
import './ReserveSessionsPage.css'

const ReserveSessionsPage = () => {
    const { id: associationId } = useParams();
    const { currentUser } = useContext(AuthContext);
    const [dates, setDates] = useState(['']);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser?.role === 'ASSOCIATION' && currentUser.id) {
            localStorage.setItem('associationId', currentUser.id);
        }
    }, [currentUser]);

    const handleDateChange = (index, value) => {
        const updatedDates = [...dates];
        updatedDates[index] = value;
        setDates(updatedDates);
    };

    const addDateInput = () => setDates([...dates, '']);

    const removeDateInput = (index) => {
        if (dates.length === 1) return; // at least 1 input always
        const updatedDates = dates.filter((_, i) => i !== index);
        setDates(updatedDates);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!associationId) {
            setMessage('Identifiant de l’association manquant.');
            return;
        }
        setLoading(true);
        const dto = { dates };
        try {
            await AssociationService.reserveSessions(associationId, dto);
            setMessage('Sessions réservées avec succès.');
            setDates(['']); // reset
        } catch (error) {
            console.error("Reservation failed:", error);
            setMessage('Erreur lors de la réservation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reserve-container">
            <h3>Réserver des Sessions</h3>
            <form onSubmit={handleSubmit} className="reserve-form">
                {dates.map((date, index) => (
                    <div key={index} className="date-input-wrapper">
                        <input
                            type="date"
                            className="date-input"
                            value={date}
                            onChange={(e) => handleDateChange(index, e.target.value)}
                            required
                        />
                        {dates.length > 1 && (
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={() => removeDateInput(index)}
                                title="Supprimer cette date"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" className="add-date-btn" onClick={addDateInput}>
                    + Ajouter une autre date
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Réservation...' : 'Réserver'}
                </button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default ReserveSessionsPage;
