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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!associationId) {
            setMessage("Identifiant de l'association manquant.");
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
        <div className="session-booking-page">
            <div className="booking-main">
                <div className="booking-card">
                    <h3 className="booking-title">Réserver des Sessions</h3>
                    <form onSubmit={handleSubmit} className="booking-form">
                        {dates.map((date, index) => (
                            <div key={index} className="date-field">
                                <div className="date-input-group">
                                    <input
                                        type="date"
                                        className="date-picker"
                                        value={date}
                                        onChange={(e) => handleDateChange(index, e.target.value)}
                                        required
                                    />
                                    {dates.length > 1 && (
                                        <button
                                            type="button"
                                            className="delete-date"
                                            onClick={() => removeDateInput(index)}
                                            title="Supprimer cette date"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button type="button" className="add-new-date" onClick={addDateInput}>
                            + Ajouter une autre date
                        </button>
                        <button type="submit" className="submit-booking" disabled={loading}>
                            {loading ? 'Réservation...' : 'Réserver'}
                        </button>
                    </form>
                    {message && <div className="status-message">{message}</div>}
                </div>

                <div className="preview-section">
                    <h4 className="preview-title">Dates Sélectionnées</h4>
                    <div className="dates-list">
                        {dates.map((date, index) => (
                            date && (
                                <div key={index} className="date-card">
                                    {formatDate(date)}
                                </div>
                            )
                        ))}
                        {!dates.some(date => date) && (
                            <div className="empty-dates">
                                Aucune date sélectionnée
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReserveSessionsPage;
