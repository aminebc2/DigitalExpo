import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import AssociationManagement from './AssociationManagement';
import VolunteerManagement from './VolunteerManagement';
import VolunteerRequests from './VolunteerRequests';
import SessionManagement from './SessionManagement';
import './AdminDashboard.css';

// Translations object
const translations = {
    fr: {
        pageTitle: "Tableau de Bord Admin",
        backToHome: "Retour à l'Accueil",
        tabs: {
            associations: "Associations",
            volunteers: "Bénévoles",
            volunteerRequests: "Demandes de Bénévolat",
            sessions: "Sessions"
        }
    },
    en: {
        pageTitle: "Admin Dashboard",
        backToHome: "Back to Home",
        tabs: {
            associations: "Associations",
            volunteers: "Volunteers",
            volunteerRequests: "Volunteer Requests",
            sessions: "Sessions"
        }
    }
};

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('associations');
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'associations':
                return <AssociationManagement />;
            case 'volunteers':
                return <VolunteerManagement />;
            case 'volunteerRequests':
                return <VolunteerRequests />;
            case 'sessions':
                return <SessionManagement />;
            default:
                return <AssociationManagement />;
        }
    };

    const tabs = [
        {
            id: 'associations',
            icon: 'fas fa-building',
            label: t.tabs.associations
        },
        {
            id: 'volunteers',
            icon: 'fas fa-users',
            label: t.tabs.volunteers
        },
        {
            id: 'volunteerRequests',
            icon: 'fas fa-user-plus',
            label: t.tabs.volunteerRequests
        },
        {
            id: 'sessions',
            icon: 'fas fa-calendar-alt',
            label: t.tabs.sessions
        }
    ];

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>
                    <i className="fas fa-tachometer-alt"></i>
                    {t.pageTitle}
                </h2>
                <button className="back-to-home" onClick={() => navigate('/home')}>
                    <i className="fas fa-home"></i>
                    {t.backToHome}
                </button>
            </div>

            <div className="dashboard-tabs">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <i className={tab.icon}></i>
                        <span>{tab.label}</span>
                    </div>
                ))}
            </div>

            <div className="dashboard-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
