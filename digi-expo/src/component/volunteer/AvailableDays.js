/*
import React, { useState, useEffect } from 'react';
import VolunteerService from '../../service/VolunteerService'; // Ensure the path is correct
import './AvailableDays.css'; // Import a CSS file for custom styles

const AvailableDays = () => {
    const [availableDays, setAvailableDays] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const authToken = localStorage.getItem('authToken');

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    const daysOfWeek = [
        'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
    ];

    // Fetch available days from the server when component mounts
    useEffect(() => {
        if (!volunteerId) {
            setMessage('Volunteer ID is missing. Please log in again.');
            return;
        }

        const fetchAvailableDays = async () => {
            setLoading(true);
            try {
                const volunteerData = await VolunteerService.getVolunteerById(volunteerId);

                if (volunteerData.volunteer && volunteerData.volunteer.availableDays) {
                    setAvailableDays(volunteerData.volunteer.availableDays);
                } else {
                    console.log("No availableDays field found");
                }
            } catch (error) {
                setMessage('Failed to load available days.');
                console.error('Error fetching available days:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailableDays();
    }, [volunteerId]);

    const handleCheckboxChange = (day) => {
        setMessage(''); // Clear previous message
        const newAvailableDays = availableDays.includes(day)
            ? availableDays.filter(d => d !== day)
            : [...availableDays, day];

        setAvailableDays(newAvailableDays);
    };


    const handleSubmit = async () => {
        if (availableDays.length === 0) {
            setMessage('Please select at least one day.');
            return;
        }

        setLoading(true);
        try {
            await VolunteerService.updateAvailableDays(volunteerId, availableDays);
            setMessage('Your available days have been updated successfully!');
        } catch (error) {
            setMessage('Failed to update days. Please try again.');
            console.error('Error updating available days:', error);
        } finally {/!**!/
            setLoading(false);
        }
    };

    return (
        <div className="available-days-container">
            <h2>Update Available Days</h2>

            {message && <p className="message">{message}</p>}

            <div className="checkbox-container">
                {daysOfWeek.map(day => (
                    <label key={day} className="checkbox-label">
                        <input
                            type="checkbox"
                            value={day}
                            checked={availableDays.includes(day)}
                            onChange={() => handleCheckboxChange(day)}
                        />
                        {day}
                    </label>
                ))}
            </div>

            <div className="submit-container">
                <button onClick={handleSubmit} disabled={loading} className="submit-btn">
                    {loading ? 'Updating...' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default AvailableDays;
*/
