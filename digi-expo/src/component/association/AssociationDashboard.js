import React from 'react';
import { Link } from 'react-router-dom';

const AssociationDashboard = () => {
    // Assuming loggedAssociationId is available in localStorage
    const loggedAssociationId = localStorage.getItem('associationId');

    return (
        <div className="container mt-4">
            <h2>Tableau de bord de l'association</h2>

            {/* Navigation Links */}
            <div className="nav flex-column nav-pills mt-4">
                <Link className="nav-link active" to={`/association/reserve`}>Réserver des Sessions</Link>
                <Link className="nav-link" to={`/association/sessions`}>Lister les Sessions</Link>
                <Link className="nav-link" to={`/association/volunteers`}>Lister les Bénévoles</Link>
            </div>

            {/* Dashboard Content */}
            <div className="mt-4">
                <h3>Bienvenue sur le tableau de bord</h3>
                <p>Gérez les sessions, réservez des dates et consultez les bénévoles à travers ce tableau de bord.</p>
            </div>
        </div>
    );
};

export default AssociationDashboard;
