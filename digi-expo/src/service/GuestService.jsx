import axios from 'axios';

export default class GuestService {
    static API_URL = 'http://localhost:8080/Guest';

    static async getAllAssociations() {
        try {
            const response = await axios.get(`${this.API_URL}/all-associations`);
            // Transform the response to match the expected format
            return {
                statusCode: response.data.statusCode,
                message: response.data.message,
                associations: response.data.associationList
            };
        } catch (error) {
            console.error('Error fetching associations:', error);
            throw error;
        }
    }

    static async getPlanning() {
        try {
            const response = await axios.get(`${this.API_URL}/planning`);
            return {
                statusCode: response.data.statusCode,
                message: response.data.message,
                planningList: response.data.planningList
            };
        } catch (error) {
            console.error('Error fetching planning:', error);
            throw error;
        }
    }
}