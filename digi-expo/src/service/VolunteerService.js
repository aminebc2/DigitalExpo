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

    static async updateAvailableDays(volunteerId, availableDays) {
        try {
            const response = await axios.post(`${this.API_URL}/available-days/${volunteerId}`,
                availableDays,{
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error updating available days:', error);
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
}
