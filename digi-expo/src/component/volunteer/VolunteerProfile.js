import React, { useEffect, useState } from "react";
import VolunteerService from "../../service/VolunteerService";
import "../association/AssociationProfile.css";

function VolunteerProfile() {
    const [volunteer, setVolunteer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const availableDaysOptions = [
        "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
        "FRIDAY", "SATURDAY", "SUNDAY"
    ];
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        availableDays: []

    });

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await VolunteerService.getVolunteerById(volunteerId);

                if (response.statusCode === 200) {
                    const volunteerData = response.volunteer;

                    // Convert availableDays string to array if needed
                    if (typeof volunteerData.availableDays === "string") {
                        volunteerData.availableDays = volunteerData.availableDays.split(",").map(day => day.trim());
                    }

                    // Also ensure it's an array if null or undefined
                    if (!Array.isArray(volunteerData.availableDays)) {
                        volunteerData.availableDays = [];
                    }

                    setVolunteer(volunteerData);
                    setFormData(volunteerData);
                } else {
                    setError(response.message || "Failed to load data");
                }
            } catch (err) {
                setError("An error occurred while fetching data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (volunteerId) {
            fetchData();
        }
    }, [volunteerId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const response = await VolunteerService.updateVolunteer(volunteerId, formData);

            if (response.statusCode === 200) {
                setVolunteer(response.data);  // ✅ this is where updated volunteer is
                setEditMode(false);
            } else {
                alert("Update failed: " + response.message);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Update failed");
        }
    };

    const handleAvailableDaysChange = (day, checked) => {
        let newDays = formData.availableDays ? [...formData.availableDays] : [];
        if (checked) {
            if (!newDays.includes(day)) newDays.push(day);
        } else {
            newDays = newDays.filter(d => d !== day);
        }
        setFormData({ ...formData, availableDays: newDays });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!volunteer) return <div>No data available.</div>;

    return (
        <div className="association-container">
            <h2>Volunteer Profile</h2>
            {editMode ? (
                <>
                    {["username", "email", "phoneNumber"].map((field) => (
                        <div key={field} className="association-info">
                            <label className="association-label">
                                {field.charAt(0).toUpperCase() + field.slice(1)}:
                            </label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field] || ""}
                                onChange={handleChange}
                                className="association-input"
                            />
                        </div>
                    ))}

                    <div className="association-info">
                        <label className="association-label">Available Days:</label>
                        <div className="checkbox-group">
                            {availableDaysOptions.map((day) => (
                                <label key={day} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        value={day}
                                        checked={formData.availableDays?.includes(day) || false}
                                        onChange={(e) => handleAvailableDaysChange(day, e.target.checked)}
                                    />
                                    {day}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="button-group">
                        <button onClick={handleSave} className="btn btn-save">Save</button>
                        <button onClick={() => setEditMode(false)} className="btn btn-cancel">Cancel</button>
                    </div>
                </>
            ) : (
                <>
                    <p><strong>Username:</strong> {volunteer.username}</p>
                    <p><strong>Email:</strong> {volunteer.email}</p>
                    <p><strong>Phone Number:</strong> {volunteer.phoneNumber}</p>
                    <p><strong>Available Days:</strong> {volunteer.availableDays?.join(", ")}</p>
                    <button onClick={() => setEditMode(true)} className="btn btn-edit">Edit</button>
                </>
            )}
        </div>
    );
}

export default VolunteerProfile;