import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VolunteerRequest = ({ volunteerId }) => {
    const [associations, setAssociations] = useState([]);
    const [selectedAssociation, setSelectedAssociation] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Load associations
        axios.get('/associations/all')
            .then(response => setAssociations(response.data))
            .catch(error => console.error('Error fetching associations:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedAssociation) {
            setMessage("Please select an association.");
            return;
        }

        try {
            const response = await axios.post('/volunteer/create-request', {
                volunteer: { id: volunteerId },
                association: { id: selectedAssociation }
            });

            setMessage(response.data.message);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error sending request';
            setMessage(errorMsg);
        }
    };

    return (
        <div className="container">
            <h2>Send Volunteer Request</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Association:</label>
                    <select
                        className="form-control"
                        value={selectedAssociation || ''}
                        onChange={e => setSelectedAssociation(e.target.value)}
                    >
                        <option value="">-- Choose an association --</option>
                        {associations.map(assoc => (
                            <option key={assoc.id} value={assoc.id}>
                                {assoc.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary mt-3">
                    Send Request
                </button>
            </form>

            {message && <p className="mt-3 alert alert-info">{message}</p>}
        </div>
    );
};

export default VolunteerRequest;
