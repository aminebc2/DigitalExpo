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
    const [reservedDates, setReservedDates] = useState([]);

    useEffect(() => {
        if (currentUser?.role === 'ASSOCIATION' && currentUser.id) {
            localStorage.setItem('associationId', currentUser.id);
            fetchReservedDates();
        }
    }, [currentUser, associationId]);

    const fetchReservedDates = async () => {
        try {
            if (!associationId) return;

            const response = await AssociationService.getSessions(associationId);
            if (response?.sessionList) {
                const reserved = response.sessionList.map(session => session.date);
                setReservedDates(reserved);
            }
        } catch (error) {
            console.error("Failed to fetch reserved dates:", error);
        }
    };

    const handleDateChange = (index, value) => {
        if (isDateReserved(value)) {
            setMessage("Cette date est déjà réservée. Veuillez en choisir une autre.");
            return;
        }

        if (dates.some((date, i) => i !== index && date === value)) {
            setMessage("Cette date est déjà sélectionnée. Veuillez en choisir une autre.");
            return;
        }

        const updatedDates = [...dates];
        updatedDates[index] = value;
        setDates(updatedDates);
        setMessage('');
    };

    const addDateInput = () => setDates([...dates, '']);

    const removeDateInput = (index) => {
        if (dates.length === 1) return;
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

    const isDateReserved = (date) => {
        return reservedDates.includes(date);
    };

    const getDisabledDates = () => {
        return reservedDates.join(',');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hasReservedDates = dates.some(date => isDateReserved(date));
        if (hasReservedDates) {
            setMessage("Certaines dates sélectionnées sont déjà réservées. Veuillez les modifier.");
            return;
        }

        if (!associationId) {
            setMessage("Identifiant de l'association manquant.");
            return;
        }

        setLoading(true);
        const dto = { dates };
        try {
            const response = await AssociationService.reserveSessions(associationId, dto);

            if (response?.message?.includes('already exist')) {
                setMessage(response.message.replace("Sessions already exist for dates: ", "Sessions déjà réservées pour les dates: "));
            } else {
                setMessage('Sessions réservées avec succès.');
                setDates(['']);
                fetchReservedDates();
            }
        } catch (error) {
            console.error("Reservation failed:", error);
            if (error.response?.message) {
                setMessage(error.response.message.replace("Sessions already exist for dates: ", "Sessions déjà réservées pour les dates: "));
            } else {
                setMessage('Erreur lors de la réservation.');
            }
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
                                        className={`date-picker ${isDateReserved(date) ? 'date-reserved' : ''}`}
                                        value={date}
                                        onChange={(e) => handleDateChange(index, e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        data-reserved-dates={getDisabledDates()}
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
                                {isDateReserved(date) && (
                                    <div className="date-error">Cette date est déjà réservée</div>
                                )}
                            </div>
                        ))}
                        <button type="button" className="add-new-date" onClick={addDateInput}>
                            + Ajouter une autre date
                        </button>
                        <button
                            type="submit"
                            className="submit-booking"
                            disabled={loading || dates.some(date => isDateReserved(date))}
                        >
                            {loading ? 'Réservation...' : 'Réserver'}
                        </button>
                    </form>
                    {message && <div className={`status-message ${message.includes('déjà') ? 'error' : 'success'}`}>
                        {message}
                    </div>}
                </div>

                <div className="preview-section">
                    <h4 className="preview-title">Dates Sélectionnées</h4>
                    <div className="dates-list">
                        {dates.map((date, index) => (
                            date && (
                                <div key={index} className={`date-card ${isDateReserved(date) ? 'date-reserved' : ''}`}>
                                    {formatDate(date)}
                                    {isDateReserved(date) && (
                                        <span className="reserved-badge">Déjà réservée</span>
                                    )}
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

            {reservedDates.length > 0 && (
                <div className="reserved-dates-section">
                    <h4>Dates déjà réservées</h4>
                    <div className="reserved-dates-list">
                        {reservedDates.map((date, index) => (
                            <div key={index} className="reserved-date-card">
                                {formatDate(date)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReserveSessionsPage;
