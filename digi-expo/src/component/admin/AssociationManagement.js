import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';
import './AssociationManagement.css';


const AssociationManagement = () => {
    const [associations, setAssociations] = useState([]);
    const [formData, setFormData] = useState(initialFormState());
    const [editingAssociation, setEditingAssociation] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [globalLoading, setGlobalLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            let response;

            // Prepare plain JSON payload
            const payload = { ...formData };

            // Remove password if updating and left empty
            if (editingAssociation && !payload.password) {
                delete payload.password;
            }

            if (editingAssociation) {
                response = await AdminService.updateAssociation(editingAssociation.id, payload);
            } else {
                if (!payload.password) {
                    setError('Password is required for creating a new association.');
                    setButtonLoading(false);
                    return;
                }
                response = await AdminService.createAssociation(payload);
            }

            if (response.statusCode === 200 || response.statusCode === 201) {
                setSuccessMessage('Association successfully saved!');
                await fetchAssociations();
                setShowForm(false);
                setFormData(initialFormState());
                setEditingAssociation(null);
            } else {
                setError(response.message || 'Failed to save association');
            }
        } catch (err) {
            console.error(err);
            setError('Network or server error while saving the association');
        } finally {
            setButtonLoading(false);
        }
    };


    function initialFormState() {
        return {
            username: '',
            email: '',
            password: '',
            role: 'ASSOCIATION',
            name: '',
            ville: '',
            responsableName: '',
            responsablePhone: ''
        };
    }

    useEffect(() => {
        fetchAssociations();
    }, []);

    const fetchAssociations = async () => {
        setGlobalLoading(true);
        setError('');
        try {
            const response = await AdminService.getAllAssociations();
            setAssociations(response.data || []);
        } catch (err) {
            setError(err.message || 'Network or server error while loading associations');
        } finally {
            setGlobalLoading(false);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (assoc) => {
        setFormData({
            username: assoc.username,
            email: assoc.email,
            password: '',
            role: assoc.role,
            name: assoc.name,
            ville: assoc.ville,
            responsableName: assoc.responsableName,
            responsablePhone: assoc.responsablePhone
        });
        setEditingAssociation(assoc);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this association?')) return;

        setGlobalLoading(true);
        try {
            await AdminService.deleteAssociation(id);
            await fetchAssociations();
        } catch (err) {
            console.error(err);
            setError('Network or server error while deleting the association');
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormState());
        setEditingAssociation(null);
        setShowForm(false);
        setError('');
        setSuccessMessage('');
    };


    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Association Management</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        handleCancel();
                        setShowForm(prev => !prev);
                    }}
                >
                    {showForm ? 'Close Form' : 'Add Association'}
                </button>
            </div>

            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}

                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="row">
                            <InputField label="Username" name="username" value={formData.username} onChange={handleInputChange} required />
                            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                        </div>
                        <div className="row">
                            <InputField
                                label={editingAssociation ? "New Password (leave empty to keep current)" : "Password"}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required={!editingAssociation}
                            />
                        </div>
                        <div className="row">
                            <InputField label="Association Name" name="name" value={formData.name} onChange={handleInputChange} required />
                            <InputField label="City" name="ville" value={formData.ville} onChange={handleInputChange} required />
                        </div>
                        <div className="row">
                            <InputField label="Responsible Person" name="responsableName" value={formData.responsableName} onChange={handleInputChange} required />
                            <InputField label="Phone Number" name="responsablePhone" value={formData.responsablePhone} onChange={handleInputChange} required />
                        </div>

                        <div className="mt-3">
                            <button type="submit" className="btn btn-success me-2" disabled={buttonLoading}>
                                {buttonLoading ? 'Saving...' : editingAssociation ? 'Update' : 'Save'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {globalLoading ? (
                    <div className="text-center mt-5"><div className="spinner-border"></div></div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Name</th>
                                <th>City</th>
                                <th>Responsible</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {associations.length > 0 ? (
                                associations.map((assoc) => (
                                    <tr key={assoc.id}>
                                        <td>{assoc.id}</td>
                                        <td>{assoc.username}</td>
                                        <td>{assoc.email}</td>
                                        <td>{assoc.name}</td>
                                        <td>{assoc.ville}</td>
                                        <td>{assoc.responsableName}</td>
                                        <td>{assoc.responsablePhone}</td>
                                        <td>
                                            <button className="btn btn-sm btn-primary me-1" onClick={() => handleEdit(assoc)}>Edit</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(assoc.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">No associations found</td>
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

const InputField = ({ label, name, value, onChange, type = "text", required = false }) => (
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

export default AssociationManagement;