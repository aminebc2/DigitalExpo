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

    const user = JSON.parse(localStorage.getItem("user"));
    const associationId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AssociationService.getAssociationById(associationId);
                if (response.statusCode === 200) {
                    setAssociation(response.association);
                    setFormData(response.association);
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

    const handleSave = async () => {
        try {
            const response = await AssociationService.updateAssociation(associationId, formData);

            // Adjust based on actual structure
            const updated = response.association || response.data || response;

            if (updated && updated.username) {
                setAssociation(updated);
                setEditMode(false);
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
            {editMode ? (
                <>
                    {["username", "email", "name", "ville", "responsableName", "responsablePhone"].map((field) => (
                        <div key={field} className="association-info">
                            <label className="association-label">{field}:</label>
                            <input
                                name={field}
                                value={formData[field] || ""}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
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