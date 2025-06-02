import React, { useEffect, useState } from 'react';
import AssociationService from "../../service/AssociationService";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaUser, FaUserFriends } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import './VolunteersListPage.css';

// Translations object
const translations = {
    fr: {
        pageTitle: "Liste des Bénévoles",
        loading: "Chargement des bénévoles...",
        error: "Erreur lors du chargement des bénévoles",
        noVolunteers: "Aucun bénévole trouvé",
        unnamedVolunteer: "Bénévole sans nom",
        email: "Email",
        phone: "Téléphone",
        notProvided: "Non fourni",
        availableDays: "Jours disponibles",
        noDaysAvailable: "Aucun jour disponible",
        days: {
            monday: "Lundi",
            tuesday: "Mardi",
            wednesday: "Mercredi",
            thursday: "Jeudi",
            friday: "Vendredi",
            saturday: "Samedi",
            sunday: "Dimanche"
        }
    },
    en: {
        pageTitle: "Volunteers List",
        loading: "Loading volunteers...",
        error: "Error fetching volunteers",
        noVolunteers: "No volunteers found",
        unnamedVolunteer: "Unnamed Volunteer",
        email: "Email",
        phone: "Phone",
        notProvided: "Not provided",
        availableDays: "Available Days",
        noDaysAvailable: "No days available",
        days: {
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sunday: "Sunday"
        }
    }
};

const VolunteersListPage = ({ associationId }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { language } = useLanguage();
    const t = translations[language];

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await AssociationService.getVolunteers(volunteerId);
                const volunteersList = response?.volunteerList;

                if (Array.isArray(volunteersList)) {
                    setVolunteers(volunteersList);
                } else {
                    setVolunteers([]);
                }
                setLoading(false);
            } catch (error) {
                setError(t.error);
                setVolunteers([]);
                setLoading(false);
            }
        };

        if (volunteerId) fetchVolunteers();
    }, [volunteerId, t.error]);

    const formatAvailableDays = (days) => {
        if (!days || days.length === 0) return t.noDaysAvailable;
        return days.map(day => {
            const dayKey = day.toLowerCase();
            return t.days[dayKey] || day;
        }).join(', ');
    };

    return (
        <div className="vol-directory">
            <div className="vol-directory__header">
                <h2 className="vol-directory__title">
                    <FaUserFriends className="vol-directory__icon" />
                    <span>{t.pageTitle}</span>
                </h2>
            </div>

            {loading ? (
                <div className="vol-directory__loading">
                    <div className="vol-directory__spinner" />
                    <p>{t.loading}</p>
                </div>
            ) : error ? (
                <div className="vol-directory__error">
                    <FaUser size={48} />
                    <p>{error}</p>
                </div>
            ) : volunteers.length === 0 ? (
                <div className="vol-directory__empty">
                    <FaUser size={48} />
                    <p>{t.noVolunteers}</p>
                </div>
            ) : (
                <div className="vol-directory__grid">
                    {volunteers.map((volunteer) => (
                        <div className="vol-member" key={volunteer.id}>
                            <div className="vol-member__header">
                                <div className="vol-member__avatar">
                                    <FaUser />
                                </div>
                                <h4 className="vol-member__name">
                                    {volunteer.username || t.unnamedVolunteer}
                                </h4>
                            </div>
                            <div className="vol-member__content">
                                <div className="vol-member__field">
                                    <FaEnvelope className="vol-member__field-icon" />
                                    <div className="vol-member__field-content">
                                        <span className="vol-member__field-label">{t.email}</span>
                                        <span className="vol-member__field-value">{volunteer.email}</span>
                                    </div>
                                </div>
                                <div className="vol-member__field">
                                    <FaPhone className="vol-member__field-icon" />
                                    <div className="vol-member__field-content">
                                        <span className="vol-member__field-label">{t.phone}</span>
                                        <span className="vol-member__field-value">
                                            {volunteer.phoneNumber || t.notProvided}
                                        </span>
                                    </div>
                                </div>
                                <div className="vol-member__field">
                                    <FaCalendarAlt className="vol-member__field-icon" />
                                    <div className="vol-member__field-content">
                                        <span className="vol-member__field-label">{t.availableDays}</span>
                                        <span className="vol-member__field-value">
                                            {formatAvailableDays(volunteer.availableDays)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VolunteersListPage;
