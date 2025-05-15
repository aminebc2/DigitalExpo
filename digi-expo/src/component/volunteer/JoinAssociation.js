import React, { useEffect, useState } from "react";
import axios from "axios";

const JoinAssociation = ({ volunteerId, token }) => {
    const [associations, setAssociations] = useState([]);
    const [message, setMessage] = useState("");
    const [joinedIds, setJoinedIds] = useState([]); // To disable buttons after joining

    useEffect(() => {
        fetchAssociations();
    }, []);

    const fetchAssociations = async () => {
        try {
            const res = await axios.get("http://localhost:8080/volunteer/all-associations"); // Adjust API path as needed
            setAssociations(res.data);
        } catch (error) {
            console.error("Error fetching associations:", error);
            setMessage("Failed to load associations.");
        }
    };

    const handleJoin = async (associationId) => {
        try {
            const dto = {
                volunteer: { id: volunteerId },
                association: { id: associationId }
            };

            const res = await axios.post(
                "http://localhost:8080/volunteer/create-request",
                dto,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setMessage(res.data.message);
            setJoinedIds([...joinedIds, associationId]); // Mark as joined
        } catch (error) {
            const errMsg = error.response?.data?.message || "Failed to send request.";
            setMessage(errMsg);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Available Associations</h2>

            {message && (
                <div className="alert alert-info" role="alert">
                    {message}
                </div>
            )}

            <div className="row">
                {associations.map((assoc) => (
                    <div key={assoc.id} className="col-md-6 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{assoc.name}</h5>
                                <p className="card-text">{assoc.description || "No description available."}</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleJoin(assoc.id)}
                                    disabled={joinedIds.includes(assoc.id)}
                                >
                                    {joinedIds.includes(assoc.id) ? "Request Sent" : "Join Association"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JoinAssociation;
