import axios from 'axios';

export default class AdminService {
    static API_URL = 'http://localhost:8080/admin';

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    static createAssociation(data) {
        const token = localStorage.getItem("token");
        return axios.post(`${this.API_URL}/association`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        })
            .then(res => res.data)
            .catch(err => {
                console.error('Error response:', err.response);
                throw err;
            });
    }

    static updateAssociation(id, data) {
        const token = localStorage.getItem("token");
        return axios.put(`${this.API_URL}/associations/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        }).then(res => res.data);
    }

    static async deleteAssociation(id) {
        const result = await axios.delete(`${this.API_URL}/associations/${id}`, {
            headers: this.getHeader()
        });
        return result.data;
    }

    static async getAllAssociations() {
        try {
            const result = await axios.get(`${this.API_URL}/associations`, {
                headers: this.getHeader()
            });
            return result.data;
        } catch (error) {
            console.error('Error fetching associations:', error.response ? error.response.data : error.message);
            throw error; // Rethrow the error after logging
        }
    }

    /*static createVolunteer(data) {
        return axios.post(`${this.API_URL}/volunteer`, data, {
            headers: this.getHeader()
        }).then(res => res.data);
    }*/

    // Create Volunteer
    static async createVolunteer(volunteerData) { // Better parameter name
        try {
            const response = await axios.post(`${this.API_URL}/volunteer`, volunteerData, {
                headers: this.getHeader()
            });
            return response.data; // ✅ Access response.data
        } catch (error) {
            console.error('Error creating volunteer:', error.response || error);
            throw error.response?.data || error; // ✅ Proper error propagation
        }
    }

// Update Volunteer
    static async updateVolunteer(id, volunteerData) {
        try {
            const response = await axios.put(`${this.API_URL}/volunteer/${id}`, volunteerData, {
                headers: this.getHeader()
            });
            return response.data; // ✅ Correct data access
        } catch (error) {
            console.error('Error updating volunteer:', error.response || error);
            throw error.response?.data || error;
        }
    }

// Delete Volunteer
    static async deleteVolunteer(id) {
        try {
            const response = await axios.delete(`${this.API_URL}/volunteer/${id}`, {
                headers: this.getHeader()
            });
            return response.data; // ✅ Correct response
        } catch (error) {
            console.error('Error deleting volunteer:', error.response || error);
            throw error.response?.data || error;
        }
    }

    static async getAllVolunteers() {
        try {
            const response = await axios.get(`${this.API_URL}/volunteers`, {
                headers: this.getHeader()
            });

            //console.log('Backend Response:', response.data);

            return {
                statusCode: response.data.statusCode,
                message: response.data.message,
                data: response.data.volunteerList || [] // ✅ FIXED HERE
            };
        } catch (error) {
            return {
                statusCode: error.response?.status || 500,
                message: error.response?.data?.message || error.message,
                data: []
            };
        }
    }

    static updateRequestStatus(requestId, status) {
        const requestPayload = {
            requestId: requestId,
            status: status
        };
        return axios.post(`${this.API_URL}/update-status`, requestPayload, {
            headers: this.getHeader()
        })
            .then(res => res.data)
            .catch(err => {
                console.error('Error response:', err.response || err);
                throw err; // Re-throwing the error for handling at the call site
            });
    }


    // Function to get all volunteer requests
    static async getAllRequests() {
        try {
            const response = await axios.get(`${this.API_URL}/all-requests`, {
                headers: this.getHeader()
            });

            return response.data; // Return the response from the server
        } catch (error) {
            console.error("Error retrieving all requests:", error);
            throw error;
        }
    }

    // Update a session (Admin only)
    static updateSession(sessionId, updatedSessionData) {
        return axios.put(`${this.API_URL}/update-session/${sessionId}`, updatedSessionData, {
            headers: this.getHeader()
        })
            .then(res => res.data)
            .catch(err => {
                console.error('Error response:', err.response || err);
                throw err; // Re-throwing the error for handling at the call site
            });
    }

// Get all sessions (Admin only)
    static async getAllSessions() {
        try {
            const result = await axios.get(`${this.API_URL}/sessions`, {
                headers: this.getHeader()
            });
            return result.data;
        } catch (error) {
            console.error('Error fetching sessions:', error.response ? error.response.data : error.message);
            throw error;  // Ensure error is properly propagated for handling
        }
    }

// Get a session by ID (Admin only)
    static async getSessionById(sessionId) {
        try {
            const result = await axios.get(`${this.API_URL}/session/${sessionId}`, {
                headers: this.getHeader()
            });
            return result.data;
        } catch (error) {
            console.error('Error fetching session by ID:', error.response ? error.response.data : error.message);
            throw error;  // Propagate error to the caller
        }
    }

    static async assignVolunteerToSession(sessionId, volunteerId, associationId) {
        try {
            const payload = { sessionId, volunteerId, associationId };
            console.log("Assigning volunteer with payload:", payload);

            const response = await axios.post(`${this.API_URL}/assign-volunteer`, payload, {
                headers: this.getHeader(),
            });

            return response.data;
        } catch (error) {
            console.error("Assign Volunteer Error:", error.response?.data || error.message);
            throw error;
        }
    }


    static async getAssoVolunteers(associationId) {
        try {
            console.log(`Fetching volunteers for association ID: ${associationId}`);

            if (!associationId) {
                console.error('Association ID is missing or invalid');
                throw new Error('Association ID is required');
            }

            const response = await axios.get(`${this.API_URL}/asso-volunteers/${associationId}`, {
                headers: this.getHeader()
            });

            console.log('Raw API Response:', response);

            // Check if response has expected structure
            if (!response || !response.data) {
                console.error('Invalid response format - missing data property');
                throw new Error('Invalid server response');
            }

            const responseData = response.data;
            console.log('Fetched Volunteers data:', responseData);

            // Return the entire response data so the component can handle the structure
            return responseData;
        } catch (error) {
            console.error("Error fetching volunteers:", error);

            // Add more detailed error information
            if (error.response) {
                // The request was made and the server responded with a non-2xx status
                console.error("Server responded with error:", error.response.status, error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received from server:", error.request);
            }

            throw error;
        }
    }


}