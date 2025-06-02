import React, { useEffect, useState } from "react";
import VolunteerService from "../../service/VolunteerService";
import { useLanguage } from '../../context/LanguageContext';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaSpinner, FaInfoCircle, FaPen, FaSave, FaTimes } from 'react-icons/fa';
import "./VolunteerProfile.css";

// Translations object
const translations = {
    fr: {
        pageTitle: "Mon Profil",
        loading: "Chargement du profil...",
        error: "Une erreur s'est produite lors du chargement des données.",
        noProfile: "Aucune donnée de profil disponible.",
        username: "Nom d'utilisateur",
        email: "Email",
        phone: "Téléphone",
        notSpecified: "Non renseigné",
        availableDays: "Jours disponibles",
        noDaysSelected: "Aucun jour sélectionné",
        edit: "Modifier",
        save: "Enregistrer",
        cancel: "Annuler",
        updateFailed: "Échec de la mise à jour : ",
        updateError: "Échec de la mise à jour du profil",
        days: {
            MONDAY: "LUNDI",
            TUESDAY: "MARDI",
            WEDNESDAY: "MERCREDI",
            THURSDAY: "JEUDI",
            FRIDAY: "VENDREDI",
            SATURDAY: "SAMEDI",
            SUNDAY: "DIMANCHE"
        }
    },
    en: {
        pageTitle: "My Profile",
        loading: "Loading profile...",
        error: "An error occurred while fetching data.",
        noProfile: "No profile data available.",
        username: "Username",
        email: "Email",
        phone: "Phone",
        notSpecified: "Not specified",
        availableDays: "Available Days",
        noDaysSelected: "No days selected",
        edit: "Edit",
        save: "Save",
        cancel: "Cancel",
        updateFailed: "Update failed: ",
        updateError: "Failed to update profile",
        days: {
            MONDAY: "MONDAY",
            TUESDAY: "TUESDAY",
            WEDNESDAY: "WEDNESDAY",
            THURSDAY: "THURSDAY",
            FRIDAY: "FRIDAY",
            SATURDAY: "SATURDAY",
            SUNDAY: "SUNDAY"
        }
    }
};

function VolunteerProfile() {
    const [volunteer, setVolunteer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const { language } = useLanguage();
    const t = translations[language];

    const availableDaysOptions = [
        "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
        "FRIDAY", "SATURDAY", "SUNDAY"
    ];

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        availableDays: []
    });

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await VolunteerService.getVolunteerById(volunteerId);

                if (response.statusCode === 200) {
                    const volunteerData = response.volunteer;

                    // Convert availableDays string to array if needed
                    if (typeof volunteerData.availableDays === "string") {
                        volunteerData.availableDays = volunteerData.availableDays.split(",").map(day => day.trim());
                    }

                    // Also ensure it's an array if null or undefined
                    if (!Array.isArray(volunteerData.availableDays)) {
                        volunteerData.availableDays = [];
                    }

                    setVolunteer(volunteerData);
                    setFormData(volunteerData);
                } else {
                    setError(response.message || t.updateFailed);
                }
            } catch (err) {
                setError(t.error);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (volunteerId) {
            fetchData();
        }
    }, [volunteerId, t.error, t.updateFailed]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const response = await VolunteerService.updateVolunteer(volunteerId, formData);

            if (response.statusCode === 200) {
                setVolunteer(response.data);
                setEditMode(false);
            } else {
                setError(t.updateFailed + response.message);
            }
        } catch (error) {
            console.error("Update error:", error);
            setError(t.updateError);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleAvailableDaysChange = (day, checked) => {
        let newDays = formData.availableDays ? [...formData.availableDays] : [];
        if (checked) {
            if (!newDays.includes(day)) newDays.push(day);
        } else {
            newDays = newDays.filter(d => d !== day);
        }
        setFormData({ ...formData, availableDays: newDays });
    };

    if (loading) {
        return (
            <div className="volunteer-profile-page">
                <div className="loading-state">
                    <FaSpinner className="spinner" />
                    <p>{t.loading}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="volunteer-profile-page">
                <div className="alert error">
                    <FaInfoCircle />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!volunteer) {
        return (
            <div className="volunteer-profile-page">
                <div className="alert error">
                    <FaInfoCircle />
                    <span>{t.noProfile}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="volunteer-profile-page">
            <div className="profile-content">
                <h2 className="page-title">
                    <FaUser />
                    <span>{t.pageTitle}</span>
                </h2>

                <div className="profile-card">
                    {editMode ? (
                        <div className="edit-form">
                            <div className="form-group">
                                <div className="input-group">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username || ""}
                                        onChange={handleChange}
                                        placeholder={t.username}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-group">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleChange}
                                        placeholder={t.email}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-group">
                                    <FaPhone className="input-icon" />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ""}
                                        onChange={handleChange}
                                        placeholder={t.phone}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="days-label">
                                    <FaCalendarAlt className="input-icon" />
                                    <span>{t.availableDays}</span>
                                </label>
                                <div className="days-grid">
                                    {availableDaysOptions.map((day) => (
                                        <label key={day} className="day-checkbox">
                                            <input
                                                type="checkbox"
                                                value={day}
                                                checked={formData.availableDays?.includes(day) || false}
                                                onChange={(e) => handleAvailableDaysChange(day, e.target.checked)}
                                            />
                                            <span className="day-label">{t.days[day]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="button-group">
                                <button
                                    onClick={handleSave}
                                    className="btn-save"
                                    disabled={saveLoading}
                                >
                                    {saveLoading ? (
                                        <FaSpinner className="spinner" />
                                    ) : (
                                        <>
                                            <FaSave />
                                            <span>{t.save}</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="btn-cancel"
                                    disabled={saveLoading}
                                >
                                    <FaTimes />
                                    <span>{t.cancel}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-info">
                            <div className="info-group">
                                <FaUser className="info-icon" />
                                <div className="info-content">
                                    <span className="info-label">{t.username}</span>
                                    <span className="info-value">{volunteer.username}</span>
                                </div>
                            </div>

                            <div className="info-group">
                                <FaEnvelope className="info-icon" />
                                <div className="info-content">
                                    <span className="info-label">{t.email}</span>
                                    <span className="info-value">{volunteer.email}</span>
                                </div>
                            </div>

                            <div className="info-group">
                                <FaPhone className="info-icon" />
                                <div className="info-content">
                                    <span className="info-label">{t.phone}</span>
                                    <span className="info-value">{volunteer.phoneNumber || t.notSpecified}</span>
                                </div>
                            </div>

                            <div className="info-group">
                                <FaCalendarAlt className="info-icon" />
                                <div className="info-content">
                                    <span className="info-label">{t.availableDays}</span>
                                    <div className="days-badges">
                                        {volunteer.availableDays?.length > 0 ? (
                                            volunteer.availableDays.map(day => (
                                                <span key={day} className="day-badge">{t.days[day]}</span>
                                            ))
                                        ) : (
                                            <span className="no-days">{t.noDaysSelected}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setEditMode(true)} className="btn-edit">
                                <FaPen />
                                <span>{t.edit}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VolunteerProfile;
