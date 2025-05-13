import React from 'react';
import { Link } from 'react-router-dom';

const VolunteerDashboard = () => {
    // Assuming loggedAssociationId is available in localStorage
    const loggedVolunteerId = localStorage.getItem('volunteerId');

    return (
        <div className="container mt-4">
            <h2>Tableau de bord de l'association</h2>

            {/* Navigation Links */}
            <div className="nav flex-column nav-pills mt-4">
                <Link className="nav-link active" to={`/volunteer/available-days`}>Available Days</Link>
                <Link className="nav-link" to={`/volunteer/sessions`}>Lister les Sessions</Link>
            </div>

            {/* Dashboard Content */}
            <div className="mt-4">
                <h3>Bienvenue sur le tableau de bord</h3>
                <p>Gérez les sessions, réservez des dates et consultez les bénévoles à travers ce tableau de bord.</p>
            </div>
        </div>
    );
};

export default VolunteerDashboard;
