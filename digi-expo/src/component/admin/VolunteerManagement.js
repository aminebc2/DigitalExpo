import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaSave,
    FaSpinner,
    FaUser,
    FaEnvelope,
    FaLock,
    FaPhone,
    FaCalendar,
    FaExclamationCircle,
    FaCheckCircle,
    FaCog, FaUserClock
} from 'react-icons/fa';
import './VolunteerManagement.css';

const VolunteerManagement = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [formData, setFormData] = useState(initialFormState());
    const [editingVolunteer, setEditingVolunteer] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [globalLoading, setGlobalLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    function initialFormState() {
        return {
            username: '',
            email: '',
            password: '',
            role: 'BENEVOLE',
            phoneNumber: '',
            availableDays: [],
        };
    }

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        setGlobalLoading(true);
        setError('');
        try {
            // Access the data property from the service result
            const result = await AdminService.getAllVolunteers();
            setVolunteers(result.data);
            if (result.data.length === 0) {
                setError('No volunteers found');
            }
        } catch (err) {
            setError(err.message || 'Failed to load volunteers');
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        setFormData(prevData => {
            const currentDays = Array.isArray(prevData.availableDays) ? [...prevData.availableDays] : [];

            if (checked && !currentDays.includes(value)) {
                currentDays.push(value);
            } else if (!checked) {
                const index = currentDays.indexOf(value);
                if (index > -1) {
                    currentDays.splice(index, 1);
                }
            }

            return {
                ...prevData,
                availableDays: currentDays
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const payload = { ...formData };

            if (editingVolunteer && !payload.password) {
                delete payload.password;
            }

            let response;
            if (editingVolunteer) {
                response = await AdminService.updateVolunteer(editingVolunteer.id, payload);
            } else {
                if (!payload.password) {
                    setError('Password is required for creating a new volunteer.');
                    setButtonLoading(false);
                    return;
                }
                response = await AdminService.createVolunteer(payload);
            }

            if (response && (response.statusCode === 200 || response.statusCode === 201)) {
                setSuccessMessage(response.message || 'Volunteer successfully saved!');
                await fetchVolunteers();
                setShowForm(false);
                setFormData(initialFormState());
                setEditingVolunteer(null);
            } else {
                console.error('Unexpected response:', response);
                setError(response?.message || 'Failed to save volunteer');
            }
        } catch (err) {
            console.error('Error saving volunteer:', err);
            setError(err.response?.data?.message || err.message || 'Network or server error while saving the volunteer');
        } finally {
            setButtonLoading(false);
        }
    };

    const handleEdit = (volunteer) => {
        setFormData({
            username: volunteer.username,
            email: volunteer.email,
            password: '', // Password is omitted in updates if left empty
            role: volunteer.role || 'BENEVOLE',
            phoneNumber: volunteer.phoneNumber || '',
            // Ensure availableDays is always an array when editing
            availableDays: Array.isArray(volunteer.availableDays) ? volunteer.availableDays : []
        });
        setEditingVolunteer(volunteer);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this volunteer?')) return;

        setGlobalLoading(true);
        setError('');
        try {
            const response = await AdminService.deleteVolunteer(id);
            if (response && response.statusCode === 200) {
                setSuccessMessage(response.message || 'Volunteer deleted successfully');
                await fetchVolunteers();
            } else {
                setError(response?.message || 'Failed to delete volunteer');
            }
        } catch (err) {
            console.error('Error deleting volunteer:', err);
            setError(err.response?.data?.message || err.message || 'Network or server error while deleting the volunteer');
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormState());
        setEditingVolunteer(null);
        setShowForm(false);
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="volunteer-management">
            <div className="volunteer-header">
                <button
                    className="volunteer-add-btn"
                    onClick={() => {
                        handleCancel();
                        setShowForm(prev => !prev);
                    }}
                >
                    {showForm ? (
                        <>
                            <FaTimes/>
                            <span>Cancel</span>
                        </>
                    ) : (
                        <>
                            <FaPlus/>
                            <span>Add Volunteer</span>
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="volunteer-alert volunteer-alert-error">
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="volunteer-alert volunteer-alert-success">
                    <FaCheckCircle />
                    <span>{successMessage}</span>
                </div>
            )}

            {showForm && (
                <div className="volunteer-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="volunteer-form-grid">
                            <div className="form-group">
                                <label>
                                    <FaUser />
                                    <span>Username</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaEnvelope />
                                    <span>Email</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaLock />
                                    <span>{editingVolunteer ? "New Password (optional)" : "Password"}</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required={!editingVolunteer}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaPhone />
                                    <span>Phone Number</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>
                                    <FaCalendar />
                                    <span>Available Days</span>
                                </label>
                                <div className="days-group">
                                    {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => (
                                        <label key={day} className="day-checkbox">
                                            <input
                                                type="checkbox"
                                                name="availableDays"
                                                value={day}
                                                checked={Array.isArray(formData.availableDays) && formData.availableDays.includes(day)}

                                                onChange={handleCheckboxChange}
                                            />
                                            <span>{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="volunteer-form-actions">
                            <button type="submit" className="volunteer-btn-save" disabled={buttonLoading}>
                                {buttonLoading ? (
                                    <>
                                        <FaSpinner className="volunteer-spinner" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        <span>{editingVolunteer ? 'Update' : 'Save'}</span>
                                    </>
                                )}
                            </button>
                            <button type="button" className="volunteer-btn-cancel" onClick={handleCancel}>
                                <FaTimes />
                                <span>Close Form</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {globalLoading ? (
                <div className="volunteer-loading">
                    <FaSpinner className="volunteer-spinner" />
                    <p>Loading volunteers...</p>
                </div>
            ) : (
                <div className="volunteer-table-wrapper">
                    <div className="volunteer-table-container">
                        <table className="volunteer-table">
                            <thead>
                            <tr>
                                <th><FaUser className="me-2" />Username</th>
                                <th><FaEnvelope className="me-2" />Email</th>
                                <th><FaPhone className="me-2" />Phone</th>
                                <th><FaCalendar className="me-2" />Available Days</th>
                                <th><FaCog className="me-2" />Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {volunteers.length > 0 ? (
                                volunteers.map((vol) => (
                                    <tr key={vol.id}>
                                        <td>{vol.username}</td>
                                        <td>{vol.email}</td>
                                        <td>{vol.phoneNumber}</td>
                                        <td>{vol.availableDays?.join(', ')}</td>
                                        <td>
                                            <div className="volunteer-actions">
                                                <button
                                                    className="volunteer-btn-edit"
                                                    onClick={() => handleEdit(vol)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="volunteer-btn-delete"
                                                    onClick={() => handleDelete(vol.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="volunteer-empty">
                                        <FaUser />
                                        <p>No volunteers found</p>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerManagement;