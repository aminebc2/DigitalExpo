import axios from 'axios';

export default class AssociationService {
    static API_URL = 'http://localhost:8080/association';

    // Get authorization header with Bearer token
    static getHeader() {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        // Check if token is properly formatted
        if (!token.startsWith("Bearer ")) {
            // If token doesn't start with Bearer, add it
            localStorage.setItem("token", `Bearer ${token}`);
        }

        return {
            headers: {
                'Authorization': token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    }

    // Helper method to check if user has association role
    static checkAssociationRole() {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user || !user.role || user.role !== 'ASSOCIATION') {
            throw new Error("User does not have association role");
        }
    }

    // Get all reserved sessions (globally)
    static async getAllReservedSessions() {
        try {
            this.checkAssociationRole();
            const response = await axios.get(`${this.API_URL}/sessions`, this.getHeader());
            return response.data;
        } catch (error) {
            if (error.message === "No authentication token found" || error.message === "User does not have association role") {
                console.error("Authentication error:", error.message);
                throw new Error("Please log in as an association to view sessions");
            }
            console.error("Error fetching all reserved sessions:", error);
            throw error;
        }
    }

    // 📋 Get all sessions of the association
    static async getSessions(associationId) {
        try {
            this.checkAssociationRole();
            const response = await axios.get(`${this.API_URL}/sessions/${associationId}`, this.getHeader());
            return response.data;
        } catch (error) {
            if (error.message === "No authentication token found" || error.message === "User does not have association role") {
                console.error("Authentication error:", error.message);
                throw new Error("Please log in as an association to view sessions");
            }
            console.error("Error fetching sessions:", error);
            throw error;
        }
    }

    // 👥 Get list of volunteers for the association
    static async getVolunteers(associationId) {
        try {
            const response = await axios.get(`${this.API_URL}/volunteers/${associationId}`, this.getHeader());
            return response.data;
        } catch (error) {
            if (error.message === "No authentication token found") {
                console.error("Authentication token missing");
                throw new Error("Please log in to view volunteers");
            }
            console.error("Error fetching volunteers:", error);
            throw error;
        }
    }

    // 📅 Reserve sessions for the association
    static async reserveSessions(associationId, dateListDTO) {
        try {
            const response = await axios.post(`${this.API_URL}/reserve/${associationId}`, dateListDTO, this.getHeader());
            return response.data;
        } catch (error) {
            if (error.message === "No authentication token found") {
                console.error("Authentication token missing");
                throw new Error("Please log in to reserve sessions");
            }
            console.error("Error reserving sessions:", error);
            throw error;
        }
    }

    // ℹ️ Get association info by ID
    static async getAssociationById(associationId) {
        try {
            const response = await axios.get(`${this.API_URL}/${associationId}`, this.getHeader());
            return response.data;
        } catch (error) {
            if (error.message === "No authentication token found") {
                console.error("Authentication token missing");
                throw new Error("Please log in to view association info");
            }
            console.error("Error fetching association info:", error);
            throw error;
        }
    }

    static async updateAssociation(id, associationData, picture) {
        try {
            // Create FormData object
            const formData = new FormData();

            // Add the association data as a JSON string
            formData.append('association', new Blob([JSON.stringify(associationData)], {
                type: 'application/json'
            }));

            // Add the picture if provided
            if (picture) {
                formData.append('picture', picture);
            }

            const headers = this.getHeader().headers;
            // Remove Content-Type as FormData will set it automatically with boundary
            delete headers['Content-Type'];

            const response = await axios.put(`${this.API_URL}/update/${id}`, formData, {
                headers: headers
            });
            return response.data;
        } catch (error) {
            if (error.message === "No authentication token found") {
                console.error("Authentication token missing");
                throw new Error("Please log in to update association");
            }
            console.error("Error updating association:", error);
            throw error;
        }
    }

    // Get session details by ID
    static async getSessionById(sessionId) {
        try {
            const response = await axios.get(`${this.API_URL}/session/${sessionId}`, this.getHeader());
            return response.data;
        } catch (error) {
            if (error.message === "No authentication token found") {
                console.error("Authentication token missing");
                throw new Error("Please log in to view session details");
            }
            console.error("Error fetching session details:", error);
            throw error;
        }
    }
}