import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssociationManagement from './AssociationManagement';
import VolunteerManagement from './VolunteerManagement';
import VolunteerRequests from './VolunteerRequests';
import SessionManagement from './SessionManagement';
import AssignVolunteerToSession from './AssignVolunteerToSession';
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
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col">
                    <h2>Admin Dashboard</h2>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3">
                    <div className="list-group">
                        <button
                            className={`list-group-item list-group-item-action ${activeTab === 'associations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('associations')}
                        >
                            Associations
                        </button>
                        <button
                            className={`list-group-item list-group-item-action ${activeTab === 'volunteers' ? 'active' : ''}`}
                            onClick={() => setActiveTab('volunteers')}
                        >
                            Volunteers
                        </button>
                        <button
                            className={`list-group-item list-group-item-action ${activeTab === 'volunteerRequests' ? 'active' : ''}`}
                            onClick={() => setActiveTab('volunteerRequests')}
                        >
                            Volunteer Requests
                        </button>
                        <button
                            className={`list-group-item list-group-item-action ${activeTab === 'sessions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('sessions')}
                        >
                            Sessions
                        </button>
                    </div>
                    <button className="btn btn-danger mt-4 w-100" onClick={() => navigate('/home')}>
                        Back to Home
                    </button>

                </div>
                <div className="col-md-9">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;