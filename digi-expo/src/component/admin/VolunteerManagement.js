import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';
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
        setFormData(prev => {
            const updatedDays = checked
                ? [...prev.availableDays, value]
                : prev.availableDays.filter(day => day !== value);
            return { ...prev, availableDays: updatedDays };
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
            availableDays: Array.isArray(volunteer.availableDays) ? volunteer.availableDays : [],
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
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Volunteer Management</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        handleCancel();
                        setShowForm(prev => !prev);
                    }}
                >
                    {showForm ? 'Close Form' : 'Add Volunteer'}
                </button>
            </div>

            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="row">
                            <InputField label="Username" name="username" value={formData.username} onChange={handleInputChange} required />
                            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                        </div>
                        <div className="row">
                            <InputField
                                label={editingVolunteer ? "New Password (leave empty to keep current)" : "Password"}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required={!editingVolunteer}
                            />
                            <div className="col-md-6 mb-3">
                                <label htmlFor="role">Role</label>
                                <select
                                    className="form-control"
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="BENEVOLE">BENEVOLE</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
                            <div className="col-md-6 mb-3">
                                <label>Available Days</label>
                                <div>
                                    {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => (
                                        <div key={day} className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="availableDays"
                                                value={day}
                                                checked={formData.availableDays.includes(day)}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="form-check-label">{day}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <button type="submit" className="btn btn-success me-2" disabled={buttonLoading}>
                                {buttonLoading ? 'Saving...' : editingVolunteer ? 'Update' : 'Save'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {globalLoading ? (
                    <div className="text-center mt-5">
                        <div className="spinner-border"></div>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Available Days</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {volunteers.length > 0 ? (
                                volunteers.map((vol) => (
                                    <tr key={vol.id}>
                                        <td>{vol.id}</td>
                                        <td>{vol.username}</td>
                                        <td>{vol.email}</td>
                                        <td>{vol.phoneNumber}</td>
                                        <td>{vol.availableDays?.join(', ')}</td>
                                        <td>
                                            <button className="btn btn-sm btn-primary me-1"
                                                    onClick={() => handleEdit(vol)}>Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(vol.id)}>Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        {volunteers.length === 0 ? "No volunteers found" : "Loading..."}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const InputField = ({label, name, value, onChange, type = "text", required = false}) => (
    <div className="col-md-6 mb-3">
        <label htmlFor={name}>{label}</label>
        <input
            type={type}
            className="form-control"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
        />
    </div>
);

export default VolunteerManagement;