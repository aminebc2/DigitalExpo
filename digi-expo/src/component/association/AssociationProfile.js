import React, { useEffect, useState } from "react";
import AssociationService from "../../service/AssociationService";
import { FaUser, FaEnvelope, FaBuilding, FaCity, FaUserTie, FaPhone, FaCamera, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import "./AssociationProfile.css";

// Translations object
const translations = {
    fr: {
        pageTitle: "Profil de l'Association",
        loading: "Chargement du profil...",
        error: "Une erreur s'est produite lors du chargement des données.",
        noData: "Aucune donnée disponible.",
        editProfile: "Modifier le Profil",
        changePhoto: "Changer la Photo",
        saveChanges: "Enregistrer",
        cancel: "Annuler",
        updateFailed: "La mise à jour a échoué",
        updateSucceededNoData: "Mise à jour réussie mais aucune donnée retournée.",
        notProvided: "Non fourni",
        fields: {
            username: "Nom d'utilisateur",
            email: "Email",
            name: "Nom",
            ville: "Ville",
            responsableName: "Nom du Responsable",
            responsablePhone: "Téléphone du Responsable"
        },
        placeholders: {
            username: "Entrez le nom d'utilisateur",
            email: "Entrez l'email",
            name: "Entrez le nom",
            ville: "Entrez la ville",
            responsableName: "Entrez le nom du responsable",
            responsablePhone: "Entrez le téléphone du responsable"
        }
    },
    en: {
        pageTitle: "Association Profile",
        loading: "Loading profile...",
        error: "An error occurred while fetching data.",
        noData: "No data available.",
        editProfile: "Edit Profile",
        changePhoto: "Change Photo",
        saveChanges: "Save Changes",
        cancel: "Cancel",
        updateFailed: "Update failed",
        updateSucceededNoData: "Update succeeded but no data returned.",
        notProvided: "Not provided",
        fields: {
            username: "Username",
            email: "Email",
            name: "Name",
            ville: "City",
            responsableName: "Manager Name",
            responsablePhone: "Manager Phone"
        },
        placeholders: {
            username: "Enter username",
            email: "Enter email",
            name: "Enter name",
            ville: "Enter city",
            responsableName: "Enter manager name",
            responsablePhone: "Enter manager phone"
        }
    }
};

function AssociationProfile() {
    const [association, setAssociation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        name: "",
        ville: "",
        responsableName: "",
        responsablePhone: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { language } = useLanguage();
    const t = translations[language];

    const user = JSON.parse(localStorage.getItem("user"));
    const associationId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AssociationService.getAssociationById(associationId);
                if (response.statusCode === 200) {
                    setAssociation(response.association);
                    setFormData(response.association);
                    if (response.association.imageFileName) {
                        setImagePreview(`http://localhost:8080/images/${response.association.imageFileName}`);
                    }
                } else {
                    setError(response.message || t.error);
                }
            } catch (err) {
                setError(t.error);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (associationId) {
            fetchData();
        }
    }, [associationId, t.error]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            let updatedAssociation;

            if (imageFile) {
                const formPayload = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    formPayload.append(key, value);
                });
                formPayload.append("imageFile", imageFile);

                const response = await AssociationService.updateAssociationWithImage(associationId, formPayload);
                updatedAssociation = response.association || response.data || response;
            } else {
                const response = await AssociationService.updateAssociation(associationId, formData);
                updatedAssociation = response.association || response.data || response;
            }

            if (updatedAssociation && updatedAssociation.username) {
                setAssociation(updatedAssociation);
                setFormData(updatedAssociation);
                if (updatedAssociation.imageFileName) {
                    setImagePreview(`http://localhost:8080/images/${updatedAssociation.imageFileName}`);
                }
                setImageFile(null);
                setEditMode(false);
                setError(null);
            } else {
                setError(t.updateSucceededNoData);
            }
        } catch (err) {
            console.error(err);
            setError(t.updateFailed);
        }
    };

    if (loading) return (
        <div className="association-loading">
            <div className="spinner"></div>
            <p>{t.loading}</p>
        </div>
    );

    if (error) return (
        <div className="association-error">
            <FaTimes size={48} />
            <p>{error}</p>
        </div>
    );

    if (!association) return (
        <div className="association-empty">
            <FaBuilding size={48} />
            <p>{t.noData}</p>
        </div>
    );

    const fields = [
        { name: 'username', icon: <FaUser />, label: t.fields.username },
        { name: 'email', icon: <FaEnvelope />, label: t.fields.email },
        { name: 'name', icon: <FaBuilding />, label: t.fields.name },
        { name: 'ville', icon: <FaCity />, label: t.fields.ville },
        { name: 'responsableName', icon: <FaUserTie />, label: t.fields.responsableName },
        { name: 'responsablePhone', icon: <FaPhone />, label: t.fields.responsablePhone },
    ];

    return (
        <div className="association-container">
            <div className="association-header">
                <h2>
                    <FaBuilding />
                    {t.pageTitle}
                </h2>
                {!editMode && (
                    <button className="edit-button" onClick={() => setEditMode(true)}>
                        <FaEdit />
                        {t.editProfile}
                    </button>
                )}
            </div>

            <div className="association-content">
                <div className="association-image-section">
                    <div className="association-image-container">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Association" className="association-image" />
                        ) : (
                            <div className="no-image-placeholder">
                                <FaBuilding size={48} />
                            </div>
                        )}
                        {editMode && (
                            <label className="image-upload-label" htmlFor="imageFile">
                                <FaCamera />
                                <span>{t.changePhoto}</span>
                                <input
                                    type="file"
                                    id="imageFile"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden-input"
                                />
                            </label>
                        )}
                    </div>
                </div>

                <div className="association-details">
                    {editMode ? (
                        <div className="edit-form">
                            {fields.map(({ name, icon, label }) => (
                                <div key={name} className="form-group">
                                    <label htmlFor={name}>
                                        {icon}
                                        {label}
                                    </label>
                                    <input
                                        id={name}
                                        name={name}
                                        value={formData[name] || ""}
                                        onChange={handleChange}
                                        placeholder={t.placeholders[name]}
                                    />
                                </div>
                            ))}

                            <div className="form-actions">
                                <button className="save-button" onClick={handleSave}>
                                    <FaSave />
                                    {t.saveChanges}
                                </button>
                                <button className="cancel-button" onClick={() => {
                                    setEditMode(false);
                                    setImageFile(null);
                                    setImagePreview(association.imageFileName ?
                                        `http://localhost:8080/images/${association.imageFileName}` : null);
                                }}>
                                    <FaTimes />
                                    {t.cancel}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="info-list">
                            {fields.map(({ name, icon, label }) => (
                                <div key={name} className="info-item">
                                    <span className="info-icon">{icon}</span>
                                    <span className="info-label">{label}:</span>
                                    <span className="info-value">{association[name] || t.notProvided}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AssociationProfile;
