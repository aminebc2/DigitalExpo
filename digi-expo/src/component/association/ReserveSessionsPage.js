import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AssociationService from '../../service/AssociationService';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './ReserveSessionsPage.css';

// Translations object
const translations = {
    fr: {
        pageTitle: "Réserver des Sessions",
        addDate: "+ Ajouter une autre date",
        deleteDate: "Supprimer cette date",
        dateReserved: "Cette date est déjà réservée par une autre association",
        dateAlreadySelected: "Cette date est déjà sélectionnée. Veuillez en choisir une autre.",
        missingAssociationId: "Identifiant de l'association manquant.",
        reservationSuccess: "Sessions réservées avec succès.",
        reservationError: "Erreur lors de la réservation.",
        reserving: "Réservation...",
        reserve: "Réserver",
        selectedDates: "Dates Sélectionnées",
        noDatesSelected: "Aucune date sélectionnée",
        reservedDates: "Dates déjà réservées",
        alreadyReserved: "Déjà réservée",
        sessionsExist: "Sessions déjà réservées pour les dates: ",
        someReserved: "Certaines dates sélectionnées sont déjà réservées. Veuillez les modifier.",
        byAssociation: "Par: ",
        dateAlreadyBooked: "Cette date est déjà réservée par {association}"
    },
    en: {
        pageTitle: "Book Sessions",
        addDate: "+ Add another date",
        deleteDate: "Delete this date",
        dateReserved: "This date is already reserved by another association",
        dateAlreadySelected: "This date is already selected. Please choose another one.",
        missingAssociationId: "Missing association ID.",
        reservationSuccess: "Sessions booked successfully.",
        reservationError: "Error during reservation.",
        reserving: "Booking...",
        reserve: "Book",
        selectedDates: "Selected Dates",
        noDatesSelected: "No dates selected",
        reservedDates: "Already Reserved Dates",
        alreadyReserved: "Already reserved",
        sessionsExist: "Sessions already exist for dates: ",
        someReserved: "Some selected dates are already reserved. Please modify them.",
        byAssociation: "By: ",
        dateAlreadyBooked: "This date is already booked by {association}"
    }
};

const ReserveSessionsPage = () => {
    const { id: associationId } = useParams();
    const { currentUser } = useContext(AuthContext);
    const { language } = useLanguage();
    const t = translations[language];
    const [dates, setDates] = useState(['']);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [reservedDates, setReservedDates] = useState([]);
    const [globalReservedDates, setGlobalReservedDates] = useState([]);

    useEffect(() => {
        if (currentUser?.role === 'ASSOCIATION' && currentUser.id) {
            localStorage.setItem('associationId', currentUser.id);
            fetchAllReservedDates();
            fetchAssociationReservedDates();
        }
    }, [currentUser, associationId]);

    const fetchAllReservedDates = async () => {
        try {
            const response = await AssociationService.getAllReservedSessions();
            if (response?.sessions) {
                const reserved = response.sessions.map(session => ({
                    date: session.date,
                    associationName: session.associationName
                }));
                setGlobalReservedDates(reserved);
            }
        } catch (error) {
            console.error("Failed to fetch global reserved dates:", error);
        }
    };

    const fetchAssociationReservedDates = async () => {
        try {
            if (!associationId) return;

            const response = await AssociationService.getSessions(associationId);
            if (response?.sessionList) {
                const reserved = response.sessionList.map(session => session.date);
                setReservedDates(reserved);
            }
        } catch (error) {
            console.error("Failed to fetch association reserved dates:", error);
        }
    };

    const handleDateChange = (index, value) => {
        const reservedDate = globalReservedDates.find(reserved => reserved.date === value);
        if (reservedDate) {
            const message = t.dateAlreadyBooked.replace('{association}', reservedDate.associationName);
            setMessage(message);
            return;
        }

        if (dates.some((date, i) => i !== index && date === value)) {
            setMessage(t.dateAlreadySelected);
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
        return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const isDateGloballyReserved = (date) => {
        return globalReservedDates.some(reserved => reserved.date === date);
    };

    const getAssociationForDate = (date) => {
        const reservation = globalReservedDates.find(reserved => reserved.date === date);
        return reservation?.associationName || '';
    };

    const getDisabledDates = () => {
        return globalReservedDates.map(reserved => reserved.date).join(',');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hasReservedDates = dates.some(date => isDateGloballyReserved(date));
        if (hasReservedDates) {
            setMessage(t.someReserved);
            return;
        }

        if (!associationId) {
            setMessage(t.missingAssociationId);
            return;
        }

        setLoading(true);
        const dto = { dates };
        try {
            const response = await AssociationService.reserveSessions(associationId, dto);

            if (response?.message?.includes('already exist')) {
                setMessage(t.sessionsExist + response.message.split(': ')[1]);
            } else {
                setMessage(t.reservationSuccess);
                setDates(['']);
                // Refresh both global and association-specific dates
                fetchAllReservedDates();
                fetchAssociationReservedDates();
            }
        } catch (error) {
            console.error("Reservation failed:", error);
            if (error.response?.message) {
                setMessage(t.sessionsExist + error.response.message.split(': ')[1]);
            } else {
                setMessage(t.reservationError);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="session-booking-page">
            <div className="booking-main">
                <div className="booking-card">
                    <h3 className="booking-title">{t.pageTitle}</h3>
                    <form onSubmit={handleSubmit} className="booking-form">
                        {dates.map((date, index) => (
                            <div key={index} className="date-field">
                                <div className="date-input-group">
                                    <input
                                        type="date"
                                        className={`date-picker ${isDateGloballyReserved(date) ? 'date-reserved' : ''}`}
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
                                            title={t.deleteDate}
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                                {isDateGloballyReserved(date) && (
                                    <div className="date-error">
                                        {t.dateReserved}
                                        <span className="association-name">
                                            {t.byAssociation} {getAssociationForDate(date)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button type="button" className="add-new-date" onClick={addDateInput}>
                            {t.addDate}
                        </button>
                        <button
                            type="submit"
                            className="submit-booking"
                            disabled={loading || dates.some(date => isDateGloballyReserved(date))}
                        >
                            {loading ? t.reserving : t.reserve}
                        </button>
                    </form>
                    {message && <div className={`status-message ${message.includes(t.sessionsExist) ? 'error' : 'success'}`}>
                        {message}
                    </div>}
                </div>

                <div className="preview-section">
                    <h4 className="preview-title">{t.selectedDates}</h4>
                    <div className="dates-list">
                        {dates.map((date, index) => (
                            date && (
                                <div key={index} className={`date-card ${isDateGloballyReserved(date) ? 'date-reserved' : ''}`}>
                                    {formatDate(date)}
                                    {isDateGloballyReserved(date) && (
                                        <div className="reserved-info">
                                            <span className="reserved-badge">{t.alreadyReserved}</span>
                                            <span className="association-name">
                                                {t.byAssociation} {getAssociationForDate(date)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )
                        ))}
                        {!dates.some(date => date) && (
                            <div className="empty-dates">
                                {t.noDatesSelected}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {globalReservedDates.length > 0 && (
                <div className="reserved-dates-section">
                    <h4>{t.reservedDates}</h4>
                    <div className="reserved-dates-list">
                        {globalReservedDates.map((reservation, index) => (
                            <div key={index} className="reserved-date-card">
                                {formatDate(reservation.date)}
                                <div className="association-name">
                                    {t.byAssociation} {reservation.associationName}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReserveSessionsPage;
