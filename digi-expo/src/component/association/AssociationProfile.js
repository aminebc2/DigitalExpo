import React, { useEffect, useState } from "react";
import AssociationService from "../../service/AssociationService";
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
    const [imageFile, setImageFile] = useState(null); // New image file state
    const [imagePreview, setImagePreview] = useState(null); // For previewing selected image

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
                        // assuming backend stores image path or filename
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
            setImagePreview(URL.createObjectURL(file)); // Show preview
        }
    };

    const handleSave = async () => {
        try {
            let updatedAssociation;

            if (imageFile) {
                // If new image selected, upload with formData using FormData
                const formPayload = new FormData();
                // Append text fields
                Object.entries(formData).forEach(([key, value]) => {
                    formPayload.append(key, value);
                });
                // Append image file
                formPayload.append("imageFile", imageFile);

                const response = await AssociationService.updateAssociationWithImage(associationId, formPayload);
                updatedAssociation = response.association || response.data || response;
            } else {
                // No image update, just send JSON data
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!association) return <div>No data available.</div>;

    return (
        <div className="association-container">
            <h2>Association Profile</h2>

            {/* Show current or preview image */}
            <div className="association-image-container">
                {imagePreview ? (
                    <img src={imagePreview} alt="Association" className="association-image" />
                ) : (
                    <div className="no-image-placeholder">No image available</div>
                )}
            </div>

            {editMode ? (
                <>
                    {["username", "email", "name", "ville", "responsableName", "responsablePhone"].map((field) => (
                        <div key={field} className="association-info">
                            <label className="association-label" htmlFor={field}>{field}:</label>
                            <input
                                id={field}
                                name={field}
                                value={formData[field] || ""}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    {/* File input for image */}
                    <div className="association-info">
                        <label className="association-label" htmlFor="imageFile">Profile Image:</label>
                        <input
                            type="file"
                            id="imageFile"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => {
                        setEditMode(false);
                        setImageFile(null);
                        // Reset preview to original image on cancel
                        setImagePreview(association.imageFileName ? `http://localhost:8080/images/${association.imageFileName}` : null);
                    }}>Cancel</button>
                </>
            ) : (
                <>
                    <p><strong>Username:</strong> {association.username}</p>
                    <p><strong>Email:</strong> {association.email}</p>
                    <p><strong>Name:</strong> {association.name}</p>
                    <p><strong>Ville:</strong> {association.ville}</p>
                    <p><strong>Responsable Name:</strong> {association.responsableName}</p>
                    <p><strong>Responsable Phone:</strong> {association.responsablePhone}</p>
                    <button onClick={() => setEditMode(true)}>Edit</button>
                </>
            )}
        </div>
    );
}

export default AssociationProfile;
