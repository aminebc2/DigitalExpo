import React, { useEffect, useState } from "react";
import AssociationService from "../../service/AssociationService";
import "./AssociationProfile.css";

function AssociationProfile() {
    const [association, setAssociation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const associationId = user?.id;

    useEffect(() => {
        const fetchAssociation = async () => {
            try {
                const response = await AssociationService.getAssociationById(associationId);
                if (response.statusCode === 200) {
                    setAssociation(response.association || {});
                } else {
                    setError(response.message || "Failed to load association");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load association");
            } finally {
                setLoading(false);
            }
        };
        fetchAssociation();
    }, [associationId]);

    if (loading) return <p>Loading association info...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!association) return <p>No association data available.</p>; // Extra guard

    return (
        <div className="association-container">
            <h2>Association Profile</h2>
            {association ? (
                <>
                    <p className="association-info">
                        <span className="association-label">Username:</span> {association.username}
                    </p>
                    <p className="association-info">
                        <span className="association-label">Email:</span> {association.email}
                    </p>
                    <p className="association-info">
                        <span className="association-label">Name:</span> {association.name}
                    </p>
                    <p className="association-info">
                        <span className="association-label">Ville:</span> {association.ville}
                    </p>
                    <p className="association-info">
                        <span className="association-label">Responsable Name:</span> {association.responsableName}
                    </p>
                    <p className="association-info">
                        <span className="association-label">Responsable Phone:</span> {association.responsablePhone}
                    </p>
                </>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
}

export default AssociationProfile;
