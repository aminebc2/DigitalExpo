import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssociationManagement from './AssociationManagement';
import VolunteerManagement from './VolunteerManagement';
import VolunteerRequests from './VolunteerRequests';
import SessionManagement from './SessionManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('associations');
    const navigate = useNavigate();

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

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>
                    <i className="fas fa-tachometer-alt"></i>
                    Admin Dashboard
                </h2>
                <button className="back-to-home" onClick={() => navigate('/home')}>
                    <i className="fas fa-home"></i>
                    Back to Home
                </button>
            </div>

            <div className="dashboard-tabs">
                <div
                    className={`tab ${activeTab === 'associations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('associations')}
                >
                    <i className="fas fa-building"></i>
                    <span>Associations</span>
                </div>
                <div
                    className={`tab ${activeTab === 'volunteers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('volunteers')}
                >
                    <i className="fas fa-users"></i>
                    <span>Volunteers</span>
                </div>
                <div
                    className={`tab ${activeTab === 'volunteerRequests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('volunteerRequests')}
                >
                    <i className="fas fa-user-plus"></i>
                    <span>Volunteer Requests</span>
                </div>
                <div
                    className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sessions')}
                >
                    <i className="fas fa-calendar-alt"></i>
                    <span>Sessions</span>
                </div>
            </div>

            <div className="dashboard-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
