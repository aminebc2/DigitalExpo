import React, { useEffect, useState } from 'react';
import AdminService from "../../service/AdminService";
import { useLanguage } from '../../context/LanguageContext';
import { FaSpinner, FaExclamationCircle, FaTimes, FaCheck } from 'react-icons/fa';
import './AssignVolunteerToSession.css';

// Translations object
const translations = {
    fr: {
        loading: "Chargement...",
        noAssociation: "Aucun ID d'association fourni",
        noVolunteers: "Aucun bénévole trouvé pour cette association",
        loadError: "Échec du chargement des bénévoles",
        selectVolunteer: "Sélectionner un Bénévole",
        chooseVolunteer: "Choisir un bénévole",
        unknownVolunteer: "Bénévole inconnu",
        pleaseSelect: "Veuillez sélectionner un bénévole",
        assignError: "Échec de l'attribution du bénévole. Veuillez réessayer.",
        cancel: "Annuler",
        assign: "Attribuer",
        assigning: "Attribution en cours..."
    },
    en: {
        loading: "Loading...",
        noAssociation: "No association ID provided",
        noVolunteers: "No volunteers found for this association",
        loadError: "Failed to load volunteers",
        selectVolunteer: "Select Volunteer",
        chooseVolunteer: "Choose a volunteer",
        unknownVolunteer: "Unknown volunteer",
        pleaseSelect: "Please select a volunteer",
        assignError: "Failed to assign volunteer. Please try again.",
        cancel: "Cancel",
        assign: "Assign Volunteer",
        assigning: "Assigning..."
    }
};

const AssignVolunteerToSession = ({ sessionId, associationId, onClose }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { language } = useLanguage();
    const t = translations[language];

    useEffect(() => {
        if (!associationId) {
            setError(t.noAssociation);
            setLoading(false);
            return;
        }

        const fetchVolunteers = async () => {
            try {
                const response = await AdminService.getAssoVolunteers(associationId);
                console.log('API Response:', response);

                const volunteerArray = Array.isArray(response) ? response :
                    response?.volunteerList && Array.isArray(response.volunteerList) ? response.volunteerList :
                        [];

                const processedVolunteers = Array.from(new Map(volunteerArray.map(v => [v.id, v])).values());
                if (processedVolunteers.length > 0) {
                    setVolunteers(processedVolunteers);
                } else {
                    setError(t.noVolunteers);
                }
            } catch (error) {
                setError(error.message || t.loadError);
            }
            setLoading(false);
        };

        fetchVolunteers();
    }, [associationId, t.noAssociation, t.noVolunteers, t.loadError]);

    const handleAssign = async () => {
        if (!selectedVolunteerId) {
            setError(t.pleaseSelect);
            return;
        }

        setSubmitting(true);
        try {
            await AdminService.assignVolunteerToSession(sessionId, selectedVolunteerId);
            onClose();
        } catch (err) {
            setError(t.assignError);
            console.error('Error assigning volunteer:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="assign-volunteer__loading">
                <FaSpinner className="assign-volunteer__spinner" />
                <span>{t.loading}</span>
            </div>
        );
    }

    return (
        <div className="assign-volunteer">
            {error && (
                <div className="assign-volunteer__error">
                    <FaExclamationCircle className="assign-volunteer__error-icon" />
                    <span>{error}</span>
                </div>
            )}

            <div className="assign-volunteer__form-group">
                <label className="assign-volunteer__label">{t.selectVolunteer}</label>
                <select
                    className="assign-volunteer__select"
                    onChange={(e) => setSelectedVolunteerId(e.target.value)}
                    value={selectedVolunteerId}
                    disabled={volunteers.length === 0}
                >
                    <option value="">{t.chooseVolunteer}</option>
                    {volunteers.map((volunteer, index) => (
                        <option
                            key={`volunteer-${volunteer.id}-${index}`}
                            value={volunteer.id || ''}
                        >
                            {volunteer.username || t.unknownVolunteer} (#{index + 1})
                        </option>
                    ))}
                </select>
            </div>

            <div className="assign-volunteer__actions">
                <button
                    className="manage-btn manage-btn--secondary"
                    onClick={onClose}
                    type="button"
                >
                    <FaTimes className="manage-btn__icon" />
                    {t.cancel}
                </button>
                <button
                    className="manage-btn manage-btn--primary"
                    onClick={handleAssign}
                    disabled={!selectedVolunteerId || submitting}
                    type="button"
                >
                    {submitting ? (
                        <>
                            <FaSpinner className="manage-spinner" />
                            <span>{t.assigning}</span>
                        </>
                    ) : (
                        <>
                            <FaCheck className="manage-btn__icon" />
                            <span>{t.assign}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AssignVolunteerToSession;
