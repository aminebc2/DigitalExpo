import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';
import './AssociationManagement.css';
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
    FaBuilding,
    FaCity,
    FaUserTie,
    FaPhone,
    FaImage,
    FaExclamationCircle,
    FaCheckCircle,
    FaCog
} from 'react-icons/fa';

const AssociationManagement = () => {
    const [associations, setAssociations] = useState([]);
    const [formData, setFormData] = useState(initialFormState());
    const [editingAssociation, setEditingAssociation] = useState(null);
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
            role: 'ASSOCIATION',
            name: '',
            ville: '',
            responsableName: '',
            responsablePhone: '',
            imageFileName: null
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const formDataToSend = new FormData();
            const { imageFile, password, ...otherData } = formData;

            if (!editingAssociation && !password) {
                setError('Password is required for creating a new association.');
                setButtonLoading(false);
                return;
            }

            const dataToSend = {
                ...otherData,
                password: password || undefined,
            };

            formDataToSend.append('data', JSON.stringify(dataToSend));

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }


            let response;
            if (editingAssociation) {
                response = await AdminService.updateAssociation(editingAssociation.id, formDataToSend);
            } else {
                response = await AdminService.createAssociation(formDataToSend);
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

    const handleEdit = (assoc) => {
        setFormData({
            username: assoc.username,
            email: assoc.email,
            password: '',
            role: assoc.role,
            name: assoc.name,
            ville: assoc.ville,
            responsableName: assoc.responsableName,
            responsablePhone: assoc.responsablePhone,
            imageFileName: assoc.imageFileName
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
        <div className="association-management">
            <div className="association-header">
                <button
                    className="association-add-btn"
                    onClick={() => {
                        if (showForm)
                        handleCancel();
                        setShowForm(prev => !prev);
                    }}
                >
                    {showForm ? (
                        <>
                            <FaTimes />
                            <span>Cancel</span>
                        </>
                    ) : (
                        <>
                            <FaPlus />
                            <span>Add Association</span>
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="association-alert association-alert-error">
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="association-alert association-alert-success">
                    <FaCheckCircle />
                    <span>{successMessage}</span>
                </div>
            )}

            {showForm && (
                <div className="association-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="association-form-grid">
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
                                    <span>{editingAssociation ? "New Password (optional)" : "Password"}</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required={!editingAssociation}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaBuilding />
                                    <span>Association Name</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaCity />
                                    <span>City</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaUserTie />
                                    <span>Responsible Person</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="responsableName"
                                        value={formData.responsableName}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
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
                                        name="responsablePhone"
                                        value={formData.responsablePhone}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="association-form-group">
                                <label htmlFor="imageFile">
                                    <FaImage />
                                    <span>Upload Image</span>
                                </label>
                                <input
                                    type="file"
                                    id="imageFile"
                                    name="imageFile"
                                    className="association-file-input"
                                    accept="image/*"
                                    onChange={(e) => setFormData(prev => ({...prev, imageFile: e.target.files[0]}))}
                                />
                            </div>
                        </div>

                        <div className="association-form-actions">
                            <button type="submit" className="association-btn-save" disabled={buttonLoading}>
                                {buttonLoading ? (
                                    <>
                                        <FaSpinner className="fa-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        <span>{editingAssociation ? 'Update' : 'Save'}</span>
                                    </>
                                )}
                            </button>
                            <button type="button" className="association-btn-cancel" onClick={handleCancel}>
                                <FaTimes />
                                <span>Close from</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {globalLoading ? (
                <div className="association-loading">
                    <FaSpinner className="fa-spin" />
                    <p>Loading associations...</p>
                </div>
            ) : (
                <div className="association-table-wrapper">
                    <div className="association-table-container">
                        <table className="association-table">
                            <thead>
                            <tr>
                                <th><FaUser className="me-2" />Username</th>
                                <th><FaEnvelope className="me-2" />Email</th>
                                <th><FaBuilding className="me-2" />Name</th>
                                <th><FaCity className="me-2" />City</th>
                                <th><FaUserTie className="me-2" />Responsible</th>
                                <th><FaPhone className="me-2" />Phone</th>
                                <th><FaImage className="me-2" />Image</th>
                                <th><FaCog className="me-2" />Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {associations.length > 0 ? (
                                associations.map((assoc) => (
                                    <tr key={assoc.id}>
                                        <td>{assoc.username}</td>
                                        <td>{assoc.email}</td>
                                        <td>{assoc.name}</td>
                                        <td>{assoc.ville}</td>
                                        <td>{assoc.responsableName}</td>
                                        <td>{assoc.responsablePhone}</td>
                                        <td>
                                            {assoc.imageFileName && (
                                                <img
                                                    src={`http://localhost:8080/images/${assoc.imageFileName}`}
                                                    alt="Association"
                                                    className="association-img"
                                                />
                                            )}
                                        </td>
                                        <td>
                                            <div className="association-actions">
                                                <button
                                                    className="association-btn-edit"
                                                    onClick={() => handleEdit(assoc)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="association-btn-delete"
                                                    onClick={() => handleDelete(assoc.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="association-empty">
                                        <FaBuilding />
                                        <p>No associations found</p>
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

export default AssociationManagement;
