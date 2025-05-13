import React, { useState, useEffect } from 'react';
import VolunteerService from '../../service/VolunteerService'; // Ensure the path is correct
import './AvailableDays.css'; // Import a CSS file for custom styles

const AvailableDays = () => {
    const [selectedDays, setSelectedDays] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const authToken = localStorage.getItem('authToken'); // Retrieve token from storage

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    // Days of the week
    const daysOfWeek = [
        'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
    ];

    useEffect(() => {
        // Check if volunteerId exists, else redirect to login page
        if (!volunteerId) {
            setMessage('Volunteer ID is missing. Please log in again.');
            return;
        }

        // Check if selected days are saved in localStorage
        const storedDays = localStorage.getItem('selectedDays');
        if (storedDays) {
            setSelectedDays(JSON.parse(storedDays)); // Parse stored data to array
        }
    }, [volunteerId]);

    // Automatically update available days when selectedDays changes
    useEffect(() => {
        if (selectedDays.length > 0) {
            setLoading(true);
            const updateAvailableDays = async () => {
                try {
                    const response = await VolunteerService.updateAvailableDays(volunteerId, selectedDays, authToken);
                    setMessage('Your available days have been updated successfully!');
                } catch (error) {
                    setMessage('Failed to update days. Please try again.');
                    console.error('Error updating available days:', error);
                } finally {
                    setLoading(false);
                }
            };

            updateAvailableDays();
        }
    }, [selectedDays, volunteerId, authToken]); // Trigger update when selectedDays change

    // Handle checkbox selection
    const handleCheckboxChange = (day) => {
        const newSelectedDays = selectedDays.includes(day)
            ? selectedDays.filter(d => d !== day) // Remove day if already selected
            : [...selectedDays, day]; // Add day to the list if not selected

        setSelectedDays(newSelectedDays);

        // Store updated selected days in localStorage
        localStorage.setItem('selectedDays', JSON.stringify(newSelectedDays));
    };

    // Handle submit manually triggered by button
    const handleSubmit = async () => {
        if (selectedDays.length === 0) {
            setMessage('Please select at least one day.');
            return;
        }

        setLoading(true);
        try {
            const response = await VolunteerService.updateAvailableDays(volunteerId, selectedDays, authToken);
            setMessage('Your available days have been updated successfully!');
        } catch (error) {
            setMessage('Failed to update days. Please try again.');
            console.error('Error updating available days:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="available-days-container">
            <h2>Update Available Days</h2>

            {/* Display message */}
            {message && <p className="message">{message}</p>}

            {/* Days of the week checkboxes */}
            <div className="checkbox-container">
                {daysOfWeek.map(day => (
                    <label key={day} className="checkbox-label">
                        <input
                            type="checkbox"
                            value={day}
                            checked={selectedDays.includes(day)} // Check if day is selected
                            onChange={() => handleCheckboxChange(day)}
                        />
                        {day}
                    </label>
                ))}
            </div>

            {/* Submit button */}
            <div className="submit-container">
                <button onClick={handleSubmit} disabled={loading} className="submit-btn">
                    {loading ? (
                        <span>Updating...</span> // Show loading text or spinner
                    ) : (
                        'Submit'
                    )}
                </button>
            </div>
        </div>
    );
};

export default AvailableDays;
