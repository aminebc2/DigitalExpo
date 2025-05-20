import axios from 'axios';

export default class AssociationService {
    static API_URL = 'http://localhost:8080/association';

    // Get authorization header with Bearer token
    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    // 📋 Get all sessions of the association
    static async getSessions(associationId) {
        try {
            const response = await axios.get(`${this.API_URL}/sessions/${associationId}`, {
                headers: this.getHeader()
            });
            return response.data; // Return the response from the backend
        } catch (error) {
            console.error("Error fetching sessions:", error);
            throw error;
        }
    }

    // 👥 Get list of volunteers for the association
    static async getVolunteers(associationId) {
        try {
            const response = await axios.get(`${this.API_URL}/volunteers/${associationId}`, {
                headers: this.getHeader()
            });
            return response.data; // Return the response from the backend
        } catch (error) {
            console.error("Error fetching volunteers:", error);
            throw error;
        }
    }


    // 📅 Reserve sessions for the association
    static async reserveSessions(associationId, dateListDTO) {
        try {
            const response = await axios.post(`${this.API_URL}/reserve/${associationId}`, dateListDTO, {
                headers: this.getHeader()
            });
            return response.data; // Return the response from the backend
        } catch (error) {
            console.error("Error reserving sessions:", error);
            throw error;
        }
    }

    // ℹ️ Get association info by ID
    static async getAssociationById(associationId) {
        try {
            const response = await axios.get(`${this.API_URL}/${associationId}`, {
                headers: this.getHeader()
            });
            return response.data; // Return the association details from the backend
        } catch (error) {
            console.error("Error fetching association info:", error);
            throw error;
        }
    }

    static  async updateAssociation(id, data){
        try {
            const response = await axios.put(`${this.API_URL}/update/${id}`, data,{
                headers: this.getHeader()
            });
            return response.data; // Return the association details from the backend
        } catch (error) {
            console.error("Error fetching association info:", error);
            throw error;
        }
    }

    // Get session details by ID
    static async getSessionById(sessionId) {
        try {
            const response = await axios.get(`${this.API_URL}/session/${sessionId}`, {
                headers: this.getHeader()
            });
            return response.data; // Return the session details from the backend
        } catch (error) {
            console.error("Error fetching session details:", error);
            throw error;
        }
    }
}