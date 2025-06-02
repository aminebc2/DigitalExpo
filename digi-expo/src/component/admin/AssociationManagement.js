import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';
import { useLanguage } from '../../context/LanguageContext';
import './AssociationManagement.css';
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
    FaBuilding,
    FaCity,
    FaUserTie,
    FaPhone,
    FaImage,
    FaExclamationCircle,
    FaCheckCircle,
    FaCog
} from 'react-icons/fa';

// Translations object
const translations = {
    fr: {
        addAssociation: "Ajouter une Association",
        cancel: "Annuler",
        loading: "Chargement des associations...",
        networkError: "Erreur réseau ou serveur lors du chargement des associations",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette association ?",
        deleteError: "Erreur réseau ou serveur lors de la suppression de l'association",
        passwordRequired: "Le mot de passe est requis pour créer une nouvelle association.",
        saveSuccess: "Association enregistrée avec succès !",
        saveFailed: "Échec de l'enregistrement de l'association",
        saveError: "Erreur réseau ou serveur lors de l'enregistrement de l'association",
        saving: "Enregistrement...",
        noAssociations: "Aucune association trouvée",
        closeForm: "Fermer le formulaire",
        form: {
            username: "Nom d'utilisateur",
            email: "Email",
            password: "Mot de passe",
            newPassword: "Nouveau mot de passe (optionnel)",
            name: "Nom de l'Association",
            city: "Ville",
            responsible: "Responsable",
            phone: "Numéro de téléphone",
            uploadImage: "Télécharger une image",
            update: "Mettre à jour",
            save: "Enregistrer"
        },
        table: {
            username: "Nom d'utilisateur",
            email: "Email",
            name: "Nom",
            city: "Ville",
            responsible: "Responsable",
            phone: "Téléphone",
            image: "Image",
            actions: "Actions"
        }
    },
    en: {
        addAssociation: "Add Association",
        cancel: "Cancel",
        loading: "Loading associations...",
        networkError: "Network or server error while loading associations",
        deleteConfirm: "Are you sure you want to delete this association?",
        deleteError: "Network or server error while deleting the association",
        passwordRequired: "Password is required for creating a new association.",
        saveSuccess: "Association successfully saved!",
        saveFailed: "Failed to save association",
        saveError: "Network or server error while saving the association",
        saving: "Saving...",
        noAssociations: "No associations found",
        closeForm: "Close form",
        form: {
            username: "Username",
            email: "Email",
            password: "Password",
            newPassword: "New Password (optional)",
            name: "Association Name",
            city: "City",
            responsible: "Responsible Person",
            phone: "Phone Number",
            uploadImage: "Upload Image",
            update: "Update",
            save: "Save"
        },
        table: {
            username: "Username",
            email: "Email",
            name: "Name",
            city: "City",
            responsible: "Responsible",
            phone: "Phone",
            image: "Image",
            actions: "Actions"
        }
    }
};

const AssociationManagement = () => {
    const [associations, setAssociations] = useState([]);
    const [formData, setFormData] = useState(initialFormState());
    const [editingAssociation, setEditingAssociation] = useState(null);
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
            role: 'ASSOCIATION',
            name: '',
            ville: '',
            responsableName: '',
            responsablePhone: '',
            imageFileName: null
        };
    }

    useEffect(() => {
        fetchAssociations();
    }, []);

    const fetchAssociations = async () => {
        setGlobalLoading(true);
        setError('');
        try {
            const response = await AdminService.getAllAssociations();
            setAssociations(response.data || []);
        } catch (err) {
            setError(t.networkError);
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const formDataToSend = new FormData();
            const { imageFile, password, ...otherData } = formData;

            if (!editingAssociation && !password) {
                setError(t.passwordRequired);
                setButtonLoading(false);
                return;
            }

            const dataToSend = {
                ...otherData,
                password: password || undefined,
            };

            formDataToSend.append('data', JSON.stringify(dataToSend));

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            let response;
            if (editingAssociation) {
                response = await AdminService.updateAssociation(editingAssociation.id, formDataToSend);
            } else {
                response = await AdminService.createAssociation(formDataToSend);
            }

            if (response.statusCode === 200 || response.statusCode === 201) {
                setSuccessMessage(t.saveSuccess);
                await fetchAssociations();
                setShowForm(false);
                setFormData(initialFormState());
                setEditingAssociation(null);
            } else {
                setError(response.message || t.saveFailed);
            }
        } catch (err) {
            console.error(err);
            setError(t.saveError);
        } finally {
            setButtonLoading(false);
        }
    };

    const handleEdit = (assoc) => {
        setFormData({
            username: assoc.username,
            email: assoc.email,
            password: '',
            role: assoc.role,
            name: assoc.name,
            ville: assoc.ville,
            responsableName: assoc.responsableName,
            responsablePhone: assoc.responsablePhone,
            imageFileName: assoc.imageFileName
        });
        setEditingAssociation(assoc);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t.deleteConfirm)) return;

        setGlobalLoading(true);
        try {
            await AdminService.deleteAssociation(id);
            await fetchAssociations();
        } catch (err) {
            console.error(err);
            setError(t.deleteError);
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormState());
        setEditingAssociation(null);
        setShowForm(false);
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="association-management">
            <div className="association-header">
                <button
                    className="association-add-btn"
                    onClick={() => {
                        if (showForm)
                            handleCancel();
                        setShowForm(prev => !prev);
                    }}
                >
                    {showForm ? (
                        <>
                            <FaTimes />
                            <span>{t.cancel}</span>
                        </>
                    ) : (
                        <>
                            <FaPlus />
                            <span>{t.addAssociation}</span>
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="association-alert association-alert-error">
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="association-alert association-alert-success">
                    <FaCheckCircle />
                    <span>{successMessage}</span>
                </div>
            )}

            {showForm && (
                <div className="association-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="association-form-grid">
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
                                    <span>{editingAssociation ? t.form.newPassword : t.form.password}</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required={!editingAssociation}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaBuilding />
                                    <span>{t.form.name}</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaCity />
                                    <span>{t.form.city}</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaUserTie />
                                    <span>{t.form.responsible}</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="responsableName"
                                        value={formData.responsableName}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
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
                                        name="responsablePhone"
                                        value={formData.responsablePhone}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="association-form-group">
                                <label htmlFor="imageFile">
                                    <FaImage />
                                    <span>{t.form.uploadImage}</span>
                                </label>
                                <input
                                    type="file"
                                    id="imageFile"
                                    name="imageFile"
                                    className="association-file-input"
                                    accept="image/*"
                                    onChange={(e) => setFormData(prev => ({...prev, imageFile: e.target.files[0]}))}
                                />
                            </div>
                        </div>

                        <div className="association-form-actions">
                            <button type="submit" className="association-btn-save" disabled={buttonLoading}>
                                {buttonLoading ? (
                                    <>
                                        <FaSpinner className="fa-spin" />
                                        <span>{t.saving}</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        <span>{editingAssociation ? t.form.update : t.form.save}</span>
                                    </>
                                )}
                            </button>
                            <button type="button" className="association-btn-cancel" onClick={handleCancel}>
                                <FaTimes />
                                <span>{t.closeForm}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {globalLoading ? (
                <div className="association-loading">
                    <FaSpinner className="fa-spin" />
                    <p>{t.loading}</p>
                </div>
            ) : (
                <div className="association-table-wrapper">
                    <div className="association-table-container">
                        <table className="association-table">
                            <thead>
                            <tr>
                                <th><FaUser className="me-2" />{t.table.username}</th>
                                <th><FaEnvelope className="me-2" />{t.table.email}</th>
                                <th><FaBuilding className="me-2" />{t.table.name}</th>
                                <th><FaCity className="me-2" />{t.table.city}</th>
                                <th><FaUserTie className="me-2" />{t.table.responsible}</th>
                                <th><FaPhone className="me-2" />{t.table.phone}</th>
                                <th><FaImage className="me-2" />{t.table.image}</th>
                                <th><FaCog className="me-2" />{t.table.actions}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {associations.length > 0 ? (
                                associations.map((assoc) => (
                                    <tr key={assoc.id}>
                                        <td>{assoc.username}</td>
                                        <td>{assoc.email}</td>
                                        <td>{assoc.name}</td>
                                        <td>{assoc.ville}</td>
                                        <td>{assoc.responsableName}</td>
                                        <td>{assoc.responsablePhone}</td>
                                        <td>
                                            {assoc.imageFileName && (
                                                <img
                                                    src={`http://localhost:8080/images/${assoc.imageFileName}`}
                                                    alt="Association"
                                                    className="association-img"
                                                />
                                            )}
                                        </td>
                                        <td>
                                            <div className="association-actions">
                                                <button
                                                    className="association-btn-edit"
                                                    onClick={() => handleEdit(assoc)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="association-btn-delete"
                                                    onClick={() => handleDelete(assoc.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="association-empty">
                                        <FaBuilding />
                                        <p>{t.noAssociations}</p>
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

export default AssociationManagement;
