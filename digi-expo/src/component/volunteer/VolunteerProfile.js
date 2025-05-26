import React, { useEffect, useState } from "react";
import VolunteerService from "../../service/VolunteerService";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaSpinner, FaInfoCircle, FaPen, FaSave, FaTimes } from 'react-icons/fa';
import "./VolunteerProfile.css";

function VolunteerProfile() {
    const [volunteer, setVolunteer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

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
                    setError(response.message || "Failed to load data");
                }
            } catch (err) {
                setError("An error occurred while fetching data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (volunteerId) {
            fetchData();
        }
    }, [volunteerId]);

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
                setError("Update failed: " + response.message);
            }
        } catch (error) {
            console.error("Update error:", error);
            setError("Failed to update profile");
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
                    <p>Loading profile...</p>
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
                    <span>No profile data available.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="volunteer-profile-page">
            <div className="profile-content">
                <h2 className="page-title">
                    <FaUser />
                    <span>Mon Profil</span>
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
                                        placeholder="Nom d'utilisateur"
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
                                        placeholder="Email"
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
                                        placeholder="Numéro de téléphone"
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="days-label">
                                    <FaCalendarAlt className="input-icon" />
                                    <span>Jours disponibles</span>
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
                                            <span className="day-label">{day}</span>
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
                                            <span>Enregistrer</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="btn-cancel"
                                    disabled={saveLoading}
                                >
                                    <FaTimes />
                                    <span>Annuler</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-info">
                            <div className="info-group">
                                <FaUser className="info-icon" />
                                <div className="info-content">
                                    <span className="info-label">Nom d'utilisateur</span>
                                    <span className="info-value">{volunteer.username}</span>
                                </div>
                            </div>

                            <div className="info-group">
                                <FaEnvelope className="info-icon" />
                                <div className="info-content">
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{volunteer.email}</span>
                                </div>
                            </div>

                            <div className="info-group">
                                <FaPhone className="info-icon" />
                                <div className="info-content">
                                    <span className="info-label">Téléphone</span>
                                    <span className="info-value">{volunteer.phoneNumber || 'Non renseigné'}</span>
                                </div>
                            </div>

                            <div className="info-group">
                                <FaCalendarAlt className="info-icon" />
                                <div className="info-content">
                                    <span className="info-label">Jours disponibles</span>
                                    <div className="days-badges">
                                        {volunteer.availableDays?.length > 0 ? (
                                            volunteer.availableDays.map(day => (
                                                <span key={day} className="day-badge">{day}</span>
                                            ))
                                        ) : (
                                            <span className="no-days">Aucun jour sélectionné</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setEditMode(true)} className="btn-edit">
                                <FaPen />
                                <span>Modifier</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VolunteerProfile;
