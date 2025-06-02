import React, { useEffect, useState } from 'react';
import VolunteerService from "../../service/VolunteerService";
import { FaBuilding, FaEnvelope, FaUserTie, FaPhone, FaHandshake, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import './AssociationList.css';

// Translations object
const translations = {
    fr: {
        pageTitle: "Associations",
        loginRequired: "Vous devez être connecté pour rejoindre une association.",
        missingVolunteerId: "ID du bénévole manquant. Veuillez vous reconnecter.",
        loadError: "Échec du chargement des associations",
        networkError: "Erreur réseau ou serveur lors du chargement des associations",
        requestSuccess: "Demande envoyée avec succès.",
        requestFailed: "Échec de l'envoi de la demande.",
        noAssociations: "Aucune association trouvée.",
        email: "Email",
        noEmail: "Aucun email fourni",
        manager: "Responsable",
        noManager: "Aucun responsable indiqué",
        phone: "Téléphone",
        noPhone: "Aucun téléphone fourni",
        sending: "Envoi en cours...",
        requestSent: "Demande envoyée",
        joinAssociation: "Rejoindre l'association"
    },
    en: {
        pageTitle: "Associations",
        loginRequired: "You must be logged in to join an association.",
        missingVolunteerId: "Volunteer ID is missing. Please log in again.",
        loadError: "Failed to load associations",
        networkError: "Network or server error while loading associations",
        requestSuccess: "Request sent successfully.",
        requestFailed: "Failed to send request.",
        noAssociations: "No associations found.",
        email: "Email",
        noEmail: "No email provided",
        manager: "Manager",
        noManager: "No manager name provided",
        phone: "Phone",
        noPhone: "No phone provided",
        sending: "Sending...",
        requestSent: "Request Sent",
        joinAssociation: "Join Association"
    }
};

const AssociationList = () => {
    const [associations, setAssociations] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [joinedIds, setJoinedIds] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const { language } = useLanguage();
    const t = translations[language];

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchAssociations = async () => {
            if (!volunteerId) {
                setError(t.missingVolunteerId);
                return;
            }
            setError('');
            try {
                const response = await VolunteerService.getAllAssociations();
                if (response.status === 200) {
                    setAssociations(response.data.associationList || []);
                } else {
                    setError(t.loadError);
                }
            } catch (err) {
                console.error(err);
                setError(t.networkError);
            }
        };

        fetchAssociations();
    }, [volunteerId, t.missingVolunteerId, t.loadError, t.networkError]);

    const handleJoinAssociation = async (associationId) => {
        if (!volunteerId) {
            setError(t.loginRequired);
            return;
        }
        setLoadingId(associationId);
        setMessage('');
        setError('');
        try {
            const res = await VolunteerService.createRequest(volunteerId, associationId);
            setMessage(res.message || t.requestSuccess);
            setJoinedIds((prev) => [...prev, associationId]);
        } catch (err) {
            const errMsg = err.response?.data?.message || t.requestFailed;
            setError(errMsg);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="associations-page">
            <div className="associations-content">
                <h2 className="page-title">
                    <FaBuilding />
                    <span>{t.pageTitle}</span>
                </h2>

                {message && (
                    <div className="alert success">
                        <FaCheckCircle className="alert-icon" />
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div className="alert error">
                        <FaExclamationTriangle className="alert-icon" />
                        <span>{error}</span>
                    </div>
                )}

                {associations.length > 0 ? (
                    <div className="associations-grid">
                        {associations.map((assoc) => (
                            <div className="association-card" key={assoc.id}>
                                <div className="card-image">
                                    {assoc.imageFileName ? (
                                        <img
                                            src={`http://localhost:8080/images/${assoc.imageFileName}`}
                                            alt={`${assoc.name} logo`}
                                        />
                                    ) : (
                                        <div className="image-placeholder">
                                            <FaBuilding />
                                        </div>
                                    )}
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">{assoc.name}</h3>

                                    <div className="card-details">
                                        <div className="detail-row">
                                            <FaEnvelope className="detail-icon" />
                                            <div className="detail-content">
                                                <span className="detail-label">{t.email}</span>
                                                <span className="detail-value">{assoc.email || t.noEmail}</span>
                                            </div>
                                        </div>
                                        <div className="detail-row">
                                            <FaUserTie className="detail-icon" />
                                            <div className="detail-content">
                                                <span className="detail-label">{t.manager}</span>
                                                <span className="detail-value">{assoc.responsableName || t.noManager}</span>
                                            </div>
                                        </div>
                                        <div className="detail-row">
                                            <FaPhone className="detail-icon" />
                                            <div className="detail-content">
                                                <span className="detail-label">{t.phone}</span>
                                                <span className="detail-value">{assoc.responsablePhone || t.noPhone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className={`join-button ${joinedIds.includes(assoc.id) ? 'joined' : ''}`}
                                        onClick={() => handleJoinAssociation(assoc.id)}
                                        disabled={joinedIds.includes(assoc.id) || loadingId === assoc.id}
                                    >
                                        {loadingId === assoc.id ? (
                                            <>
                                                <FaSpinner className="spinner" />
                                                <span>{t.sending}</span>
                                            </>
                                        ) : joinedIds.includes(assoc.id) ? (
                                            <>
                                                <FaCheckCircle />
                                                <span>{t.requestSent}</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaHandshake />
                                                <span>{t.joinAssociation}</span>
                                                <FaArrowRight className="arrow-icon" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-associations">
                        <FaBuilding className="empty-icon" />
                        <p>{t.noAssociations}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssociationList;
