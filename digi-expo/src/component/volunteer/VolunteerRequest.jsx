import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';

// Translations object
const translations = {
    fr: {
        pageTitle: "Envoyer une Demande de Bénévolat",
        selectAssociation: "Sélectionner une Association:",
        chooseAssociation: "-- Choisir une association --",
        sendRequest: "Envoyer la Demande",
        pleaseSelect: "Veuillez sélectionner une association.",
        alreadyMember: "Vous êtes déjà membre de cette association",
        errorFetching: "Erreur lors de la récupération des associations:",
        errorSending: "Erreur lors de l'envoi de la demande",
        loadingMemberships: "Chargement des adhésions..."
    },
    en: {
        pageTitle: "Send Volunteer Request",
        selectAssociation: "Select Association:",
        chooseAssociation: "-- Choose an association --",
        sendRequest: "Send Request",
        pleaseSelect: "Please select an association.",
        alreadyMember: "You are already a member of this association",
        errorFetching: "Error fetching associations:",
        errorSending: "Error sending request",
        loadingMemberships: "Loading memberships..."
    }
};

const VolunteerRequest = ({ volunteerId }) => {
    const [associations, setAssociations] = useState([]);
    const [selectedAssociation, setSelectedAssociation] = useState(null);
    const [message, setMessage] = useState('');
    const [membershipIds, setMembershipIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const t = translations[language];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all associations
                const associationsRes = await axios.get('http://localhost:8080/associations/all');
                setAssociations(associationsRes.data);

                // Fetch volunteer's existing memberships
                const membershipsRes = await axios.get(
                    `http://localhost:8080/volunteer/${volunteerId}/memberships`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                // Extract association IDs where the volunteer is already a member
                const memberIds = membershipsRes.data.map(membership => membership.associationId);
                setMembershipIds(memberIds);
            } catch (error) {
                console.error(t.errorFetching, error);
                setMessage(t.errorFetching);
            } finally {
                setLoading(false);
            }
        };

        if (volunteerId) {
            fetchData();
        }
    }, [volunteerId, t.errorFetching]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedAssociation) {
            setMessage(t.pleaseSelect);
            return;
        }

        // Check if already a member
        if (membershipIds.includes(Number(selectedAssociation))) {
            setMessage(t.alreadyMember);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/volunteer/create-request', {
                volunteer: { id: volunteerId },
                association: { id: selectedAssociation }
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            setMessage(response.data.message);
        } catch (error) {
            const errorMsg = error.response?.data?.message || t.errorSending;
            setMessage(errorMsg);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="alert alert-info" role="alert">
                    {t.loadingMemberships}
                </div>
            </div>
        );
    }

    // Filter out associations where volunteer is already a member
    const availableAssociations = associations.filter(
        assoc => !membershipIds.includes(assoc.id)
    );

    return (
        <div className="container">
            <h2>{t.pageTitle}</h2>

            {availableAssociations.length > 0 ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t.selectAssociation}</label>
                        <select
                            className="form-control"
                            value={selectedAssociation || ''}
                            onChange={e => setSelectedAssociation(e.target.value)}
                        >
                            <option value="">{t.chooseAssociation}</option>
                            {availableAssociations.map(assoc => (
                                <option key={assoc.id} value={assoc.id}>
                                    {assoc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">
                        {t.sendRequest}
                    </button>
                </form>
            ) : (
                <div className="alert alert-info" role="alert">
                    {t.alreadyMember}
                </div>
            )}

            {message && <p className="mt-3 alert alert-info">{message}</p>}
        </div>
    );
};

export default VolunteerRequest;
