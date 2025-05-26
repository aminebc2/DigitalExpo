import React, { useEffect, useState } from "react";
import AssociationService from "../../service/AssociationService";
import { FaUser, FaEnvelope, FaBuilding, FaCity, FaUserTie, FaPhone, FaCamera, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import "./AssociationProfile.css";

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
                    setError(response.message || "Failed to load data");
                }
            } catch (err) {
                setError("An error occurred while fetching data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (associationId) {
            fetchData();
        }
    }, [associationId]);

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
                setError("Update succeeded but no data returned.");
            }
        } catch (err) {
            console.error(err);
            setError("Update failed");
        }
    };

    if (loading) return (
        <div className="association-loading">
            <div className="spinner"></div>
            <p>Loading profile...</p>
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
            <p>No data available.</p>
        </div>
    );

    const fields = [
        { name: 'username', icon: <FaUser />, label: 'Username' },
        { name: 'email', icon: <FaEnvelope />, label: 'Email' },
        { name: 'name', icon: <FaBuilding />, label: 'Name' },
        { name: 'ville', icon: <FaCity />, label: 'City' },
        { name: 'responsableName', icon: <FaUserTie />, label: 'Manager Name' },
        { name: 'responsablePhone', icon: <FaPhone />, label: 'Manager Phone' },
    ];

    return (
        <div className="association-container">
            <div className="association-header">
                <h2>
                    <FaBuilding />
                    Association Profile
                </h2>
                {!editMode && (
                    <button className="edit-button" onClick={() => setEditMode(true)}>
                        <FaEdit />
                        Edit Profile
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
                                <span>Change Photo</span>
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
                                        placeholder={`Enter ${label.toLowerCase()}`}
                                    />
                                </div>
                            ))}

                            <div className="form-actions">
                                <button className="save-button" onClick={handleSave}>
                                    <FaSave />
                                    Save Changes
                                </button>
                                <button className="cancel-button" onClick={() => {
                                    setEditMode(false);
                                    setImageFile(null);
                                    setImagePreview(association.imageFileName ?
                                        `http://localhost:8080/images/${association.imageFileName}` : null);
                                }}>
                                    <FaTimes />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="info-list">
                            {fields.map(({ name, icon, label }) => (
                                <div key={name} className="info-item">
                                    <span className="info-icon">{icon}</span>
                                    <span className="info-label">{label}:</span>
                                    <span className="info-value">{association[name] || 'Not provided'}</span>
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