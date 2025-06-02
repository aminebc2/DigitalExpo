import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';
import { useLanguage } from '../../context/LanguageContext';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaSave,
    FaSpinner,
    FaUser,
    FaEnvelope,
    FaLock,
    FaPhone,
    FaCalendar,
    FaExclamationCircle,
    FaCheckCircle,
    FaCog,
    FaUserClock
} from 'react-icons/fa';
import './VolunteerManagement.css';

const translations = {
    fr: {
        loading: "Chargement des bénévoles...",
        noVolunteers: "Aucun bénévole trouvé",
        addVolunteer: "Ajouter un Bénévole",
        cancel: "Annuler",
        closeForm: "Fermer le formulaire",
        saving: "Enregistrement...",
        save: "Enregistrer",
        update: "Mettre à jour",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce bénévole ?",
        deleteSuccess: "Bénévole supprimé avec succès",
        deleteFailed: "Échec de la suppression du bénévole",
        saveSuccess: "Bénévole enregistré avec succès !",
        saveFailed: "Échec de l'enregistrement du bénévole",
        passwordRequired: "Le mot de passe est requis pour créer un nouveau bénévole.",
        networkError: "Erreur réseau ou serveur lors de l'enregistrement du bénévole",
        form: {
            username: "Nom d'utilisateur",
            email: "Email",
            password: "Mot de passe",
            newPassword: "Nouveau mot de passe (optionnel)",
            phone: "Numéro de téléphone",
            availableDays: "Jours disponibles"
        },
        days: {
            MONDAY: "LUNDI",
            TUESDAY: "MARDI",
            WEDNESDAY: "MERCREDI",
            THURSDAY: "JEUDI",
            FRIDAY: "VENDREDI",
            SATURDAY: "SAMEDI",
            SUNDAY: "DIMANCHE"
        },
        table: {
            username: "Nom d'utilisateur",
            email: "Email",
            phone: "Téléphone",
            availableDays: "Jours disponibles",
            actions: "Actions"
        }
    },
    en: {
        loading: "Loading volunteers...",
        noVolunteers: "No volunteers found",
        addVolunteer: "Add Volunteer",
        cancel: "Cancel",
        closeForm: "Close Form",
        saving: "Saving...",
        save: "Save",
        update: "Update",
        deleteConfirm: "Are you sure you want to delete this volunteer?",
        deleteSuccess: "Volunteer deleted successfully",
        deleteFailed: "Failed to delete volunteer",
        saveSuccess: "Volunteer successfully saved!",
        saveFailed: "Failed to save volunteer",
        passwordRequired: "Password is required for creating a new volunteer.",
        networkError: "Network or server error while saving the volunteer",
        form: {
            username: "Username",
            email: "Email",
            password: "Password",
            newPassword: "New Password (optional)",
            phone: "Phone Number",
            availableDays: "Available Days"
        },
        days: {
            MONDAY: "MONDAY",
            TUESDAY: "TUESDAY",
            WEDNESDAY: "WEDNESDAY",
            THURSDAY: "THURSDAY",
            FRIDAY: "FRIDAY",
            SATURDAY: "SATURDAY",
            SUNDAY: "SUNDAY"
        },
        table: {
            username: "Username",
            email: "Email",
            phone: "Phone",
            availableDays: "Available Days",
            actions: "Actions"
        }
    }
};

const VolunteerManagement = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [formData, setFormData] = useState(initialFormState());
    const [editingVolunteer, setEditingVolunteer] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [globalLoading, setGlobalLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { language } = useLanguage();
    const t = translations[language];

    function initialFormState() {
        return {
            username: '',
            email: '',
            password: '',
            role: 'BENEVOLE',
            phoneNumber: '',
            availableDays: [],
        };
    }

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        setGlobalLoading(true);
        setError('');
        try {
            const result = await AdminService.getAllVolunteers();
            setVolunteers(result.data);
            if (result.data.length === 0) {
                setError(t.noVolunteers);
            }
        } catch (err) {
            setError(err.message || t.saveFailed);
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        setFormData(prevData => {
            const currentDays = Array.isArray(prevData.availableDays) ? [...prevData.availableDays] : [];

            if (checked && !currentDays.includes(value)) {
                currentDays.push(value);
            } else if (!checked) {
                const index = currentDays.indexOf(value);
                if (index > -1) {
                    currentDays.splice(index, 1);
                }
            }

            return {
                ...prevData,
                availableDays: currentDays
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const payload = { ...formData };

            if (editingVolunteer && !payload.password) {
                delete payload.password;
            }

            let response;
            if (editingVolunteer) {
                response = await AdminService.updateVolunteer(editingVolunteer.id, payload);
            } else {
                if (!payload.password) {
                    setError(t.passwordRequired);
                    setButtonLoading(false);
                    return;
                }
                response = await AdminService.createVolunteer(payload);
            }

            if (response && (response.statusCode === 200 || response.statusCode === 201)) {
                setSuccessMessage(response.message || t.saveSuccess);
                await fetchVolunteers();
                setShowForm(false);
                setFormData(initialFormState());
                setEditingVolunteer(null);
            } else {
                console.error('Unexpected response:', response);
                setError(response?.message || t.saveFailed);
            }
        } catch (err) {
            console.error('Error saving volunteer:', err);
            setError(err.response?.data?.message || err.message || t.networkError);
        } finally {
            setButtonLoading(false);
        }
    };

    const handleEdit = (volunteer) => {
        setFormData({
            username: volunteer.username,
            email: volunteer.email,
            password: '',
            role: volunteer.role || 'BENEVOLE',
            phoneNumber: volunteer.phoneNumber || '',
            availableDays: Array.isArray(volunteer.availableDays) ? volunteer.availableDays : []
        });
        setEditingVolunteer(volunteer);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t.deleteConfirm)) return;

        setGlobalLoading(true);
        setError('');
        try {
            const response = await AdminService.deleteVolunteer(id);
            if (response && response.statusCode === 200) {
                setSuccessMessage(response.message || t.deleteSuccess);
                await fetchVolunteers();
            } else {
                setError(response?.message || t.deleteFailed);
            }
        } catch (err) {
            console.error('Error deleting volunteer:', err);
            setError(err.response?.data?.message || err.message || t.networkError);
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormState());
        setEditingVolunteer(null);
        setShowForm(false);
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="volunteer-management">
            <div className="volunteer-header">
                <button
                    className="volunteer-add-btn"
                    onClick={() => {
                        handleCancel();
                        setShowForm(prev => !prev);
                    }}
                >
                    {showForm ? (
                        <>
                            <FaTimes/>
                            <span>{t.cancel}</span>
                        </>
                    ) : (
                        <>
                            <FaPlus/>
                            <span>{t.addVolunteer}</span>
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="volunteer-alert volunteer-alert-error">
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="volunteer-alert volunteer-alert-success">
                    <FaCheckCircle />
                    <span>{successMessage}</span>
                </div>
            )}

            {showForm && (
                <div className="volunteer-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="volunteer-form-grid">
                            <div className="form-group">
                                <label>
                                    <FaUser />
                                    <span>{t.form.username}</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaEnvelope />
                                    <span>{t.form.email}</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaLock />
                                    <span>{editingVolunteer ? t.form.newPassword : t.form.password}</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required={!editingVolunteer}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaPhone />
                                    <span>{t.form.phone}</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>
                                    <FaCalendar />
                                    <span>{t.form.availableDays}</span>
                                </label>
                                <div className="days-group">
                                    {Object.keys(t.days).map(day => (
                                        <label key={day} className="day-checkbox">
                                            <input
                                                type="checkbox"
                                                name="availableDays"
                                                value={day}
                                                checked={Array.isArray(formData.availableDays) && formData.availableDays.includes(day)}
                                                onChange={handleCheckboxChange}
                                            />
                                            <span>{t.days[day]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="volunteer-form-actions">
                            <button type="submit" className="volunteer-btn-save" disabled={buttonLoading}>
                                {buttonLoading ? (
                                    <>
                                        <FaSpinner className="volunteer-spinner" />
                                        <span>{t.saving}</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        <span>{editingVolunteer ? t.update : t.save}</span>
                                    </>
                                )}
                            </button>
                            <button type="button" className="volunteer-btn-cancel" onClick={handleCancel}>
                                <FaTimes />
                                <span>{t.closeForm}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {globalLoading ? (
                <div className="volunteer-loading">
                    <FaSpinner className="volunteer-spinner" />
                    <p>{t.loading}</p>
                </div>
            ) : (
                <div className="volunteer-table-wrapper">
                    <div className="volunteer-table-container">
                        <table className="volunteer-table">
                            <thead>
                            <tr>
                                <th><FaUser className="me-2" />{t.table.username}</th>
                                <th><FaEnvelope className="me-2" />{t.table.email}</th>
                                <th><FaPhone className="me-2" />{t.table.phone}</th>
                                <th><FaCalendar className="me-2" />{t.table.availableDays}</th>
                                <th><FaCog className="me-2" />{t.table.actions}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {volunteers.length > 0 ? (
                                volunteers.map((vol) => (
                                    <tr key={vol.id}>
                                        <td>{vol.username}</td>
                                        <td>{vol.email}</td>
                                        <td>{vol.phoneNumber}</td>
                                        <td>{vol.availableDays?.map(day => t.days[day]).join(', ')}</td>
                                        <td>
                                            <div className="volunteer-actions">
                                                <button
                                                    className="volunteer-btn-edit"
                                                    onClick={() => handleEdit(vol)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="volunteer-btn-delete"
                                                    onClick={() => handleDelete(vol.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="volunteer-empty">
                                        <FaUser />
                                        <p>{t.noVolunteers}</p>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerManagement;
