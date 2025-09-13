import axios from 'axios';

export default class VolunteerService {
    static API_URL = 'http://localhost:8080/volunteer';

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    static async getAvailableSessions(volunteerId) {
        try {
            const response = await axios.get(`${this.API_URL}/available-sessions/${volunteerId}`, {
                headers: this.getHeader()
            });
            return response.data; // { statusCode, message, data: [sessions] }
        } catch (error) {
            console.error('Error fetching available sessions:', error);
            throw error;
        }
    }

    static async getPendingSessions(volunteerId) {
        const response = await axios.get(`${this.API_URL}/pending-sessions/${volunteerId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async chooseSession(sessionId, volunteerId) {
        try {
            const dto = { sessionId, volunteerId };
            const response = await axios.post(`${this.API_URL}/choose-session`, dto, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error choosing session:', error);
            throw error;
        }
    }

    static async getSessions(volunteerId) {
        try {
            const response = await axios.get(`${this.API_URL}/sessions/${volunteerId}`, {
                headers: this.getHeader()
            });
            return response.data; // Correct: Return just the data, no `.data.data`
        } catch (error) {
            console.error('Error fetching sessions:', error);
            throw error;
        }
    }

    static async getAllAssociations() {
        try {
            const response = await axios.get(`${this.API_URL}/all-associations`, {
                headers: this.getHeader()
            });
            return response; // ✅ return full response object
        } catch (error) {
            console.error('Error fetching associations', error);
            throw error;
        }
    }

    static async createRequest(volunteerId, associationId) {
        const dto = {
            volunteer: { id: volunteerId },
            association: { id: associationId }
        };
        const response = await axios.post(`${this.API_URL}/create-request`, dto, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getVolunteerById(volunteerId) {
        try {
            const response = await axios.get(`${this.API_URL}/${volunteerId}`,{
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching volunteer info:", error);
            throw error;
        }
    }

    static  async updateVolunteer(id, data){
        try {
            const response = await axios.put(`${this.API_URL}/update/${id}`, data,{
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching volunteer info:", error);
            throw error;
        }
    }

}

