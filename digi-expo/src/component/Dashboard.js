import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { currentUser, logout } = useContext(AuthContext);

    return (
        <div className="card">
            <div className="card-header">
                <h2>Dashboard</h2>
            </div>
            <div className="card-body">
                <h3>Welcome, {currentUser.username}!</h3>
                <p>Email: {currentUser.email}</p>
                <p>Role: {currentUser.role}</p>
                <button
                    className="btn btn-danger"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;