import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from '../../context/LanguageContext';

// Translations object
const translations = {
    fr: {
        pageTitle: "Associations Disponibles",
        loadError: "Échec du chargement des associations.",
        requestFailed: "Échec de l'envoi de la demande.",
        noDescription: "Aucune description disponible.",
        requestSent: "Demande envoyée",
        alreadyJoined: "Déjà membre",
        loadingMemberships: "Chargement des adhésions..."
    },
    en: {
        pageTitle: "Available Associations",
        loadError: "Failed to load associations.",
        requestFailed: "Failed to send request.",
        noDescription: "No description available.",
        requestSent: "Request Sent",
        alreadyJoined: "Already joined",
        loadingMemberships: "Loading memberships..."
    }
};

const JoinAssociation = ({ volunteerId, token }) => {
    const [associations, setAssociations] = useState([]);
    const [message, setMessage] = useState("");
    const [joinedIds, setJoinedIds] = useState([]); // To disable buttons after joining
    const [membershipIds, setMembershipIds] = useState([]); // To track existing memberships
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const t = translations[language];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all associations
                const associationsRes = await axios.get("http://localhost:8080/volunteer/all-associations");
                setAssociations(associationsRes.data);

                // Fetch volunteer's existing memberships
                const membershipsRes = await axios.get(
                    `http://localhost:8080/volunteer/${volunteerId}/memberships`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // Extract association IDs where the volunteer is already a member
                const memberIds = membershipsRes.data.map(membership => membership.associationId);
                setMembershipIds(memberIds);
            } catch (error) {
                console.error("Error fetching data:", error);
                setMessage(t.loadError);
            } finally {
                setLoading(false);
            }
        };

        if (volunteerId) {
            fetchData();
        }
    }, [volunteerId, token, t.loadError]);

    const handleJoin = async (associationId) => {
        try {
            const dto = {
                volunteer: { id: volunteerId },
                association: { id: associationId }
            };

            const res = await axios.post(
                "http://localhost:8080/volunteer/create-request",
                dto,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setMessage(res.data.message);
            setJoinedIds([...joinedIds, associationId]); // Mark as joined
        } catch (error) {
            const errMsg = error.response?.data?.message || t.requestFailed;
            setMessage(errMsg);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{t.pageTitle}</h2>

            {message && (
                <div className="alert alert-info" role="alert">
                    {message}
                </div>
            )}

            <div className="row">
                {associations.map((assoc) => (
                    <div key={assoc.id} className="col-md-6 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{assoc.name}</h5>
                                <p className="card-text">{assoc.description || t.noDescription}</p>
                                <button
                                    className={`btn ${membershipIds.includes(assoc.id) ? 'btn-success' : 'btn-primary'}`}
                                    onClick={() => !membershipIds.includes(assoc.id) && handleJoin(assoc.id)}
                                    disabled={membershipIds.includes(assoc.id) || joinedIds.includes(assoc.id)}
                                >
                                    {membershipIds.includes(assoc.id) ? (
                                        t.alreadyJoined
                                    ) : joinedIds.includes(assoc.id) ? (
                                        t.requestSent
                                    ) : (
                                        t.alreadyJoined
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JoinAssociation;