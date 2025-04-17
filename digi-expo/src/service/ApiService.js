import axios from "axios";

export default class AuthApiService {
    static BASE_URL = "http://localhost:4040";  // Update with your actual backend URL

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    /** REGISTER */

    // Register a new user
    static async registerUser(registerRequest) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/register`, registerRequest);
            return response.data;  // Response from the backend containing token and user details
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Registration failed"
            };
        }
    }

    /** LOGIN */

    // Login a user
    static async loginUser(loginRequest) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/login`, loginRequest);
            const data = response.data;

            // Store token in localStorage
            if (data && data.token) {
                localStorage.setItem("token", data.token);
            }

            return data;  // Response from the backend containing token and user details
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Login failed"
            };
        }
    }

    /** LOGOUT */

    // Logout user
    static logout() {
        localStorage.removeItem("token");
    }

    /** CHECK IF USER IS AUTHENTICATED */

    static isAuthenticated() {
        return !!localStorage.getItem("token");
    }

    /** GET CURRENT USER */

    static getCurrentUser() {
        // Assuming the backend returns a user object when the user is logged in
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }

    // ---------------- Admin Endpoints ---------------- //

    /** CREATE ASSOCIATION */
    static async createAssociation(associationRequest) {
        try {
            const response = await axios.post(`${this.BASE_URL}/admin/association`, associationRequest, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to create association"
            };
        }
    }

    /** UPDATE ASSOCIATION */
    static async updateAssociation(associationId, associationRequest) {
        try {
            const response = await axios.put(`${this.BASE_URL}/admin/association/${associationId}`, associationRequest, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to update association"
            };
        }
    }

    /** DELETE ASSOCIATION */
    static async deleteAssociation(associationId) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/admin/association/${associationId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to delete association"
            };
        }
    }

    /** GET ALL ASSOCIATIONS */
    static async getAllAssociations() {
        try {
            const response = await axios.get(`${this.BASE_URL}/admin/associations`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to fetch associations"
            };
        }
    }

    // ---------------- Volunteer Endpoints ---------------- //

    /** CREATE VOLUNTEER */
    static async createVolunteer(volunteerRequest) {
        try {
            const response = await axios.post(`${this.BASE_URL}/admin/volunteer`, volunteerRequest, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to create volunteer"
            };
        }
    }

    /** UPDATE VOLUNTEER */
    static async updateVolunteer(volunteerId, volunteerRequest) {
        try {
            const response = await axios.put(`${this.BASE_URL}/admin/volunteer/${volunteerId}`, volunteerRequest, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to update volunteer"
            };
        }
    }

    /** DELETE VOLUNTEER */
    static async deleteVolunteer(volunteerId) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/admin/volunteer/${volunteerId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to delete volunteer"
            };
        }
    }

    /** GET ALL VOLUNTEERS */
    static async getAllVolunteers() {
        try {
            const response = await axios.get(`${this.BASE_URL}/admin/volunteers`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to fetch volunteers"
            };
        }
    }

    /** VALIDATE VOLUNTEER REQUEST */
    static async validateVolunteerRequest(requestId) {
        try {
            const response = await axios.post(`${this.BASE_URL}/admin/validate-request/${requestId}`, null, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to validate volunteer request"
            };
        }
    }

    /** CONFIRM SESSION */
    static async confirmSession(sessionId, status) {
        try {
            const response = await axios.post(`${this.BASE_URL}/admin/confirm-session/${sessionId}`, { status }, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to confirm session"
            };
        }
    }

    /** RESERVE SESSIONS */

    // Reserve sessions for an association
    static async reserveSessions(associationId, dateListDTO) {
        try {
            const response = await axios.post(`${this.BASE_URL}/association/reserve-sessions/${associationId}`, dateListDTO, {
                headers: this.getHeader()
            });
            return response.data;  // Response from the backend
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to reserve sessions"
            };
        }
    }

    /** GET ALL SESSIONS */

    // Get all sessions for a given association
    static async getSessions(associationId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/association/sessions/${associationId}`, {
                headers: this.getHeader()
            });
            return response.data;  // Response from the backend
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to retrieve sessions"
            };
        }
    }

    /** GET VOLUNTEERS */

    // Get all volunteers for a given association
    static async getVolunteers(associationId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/association/volunteers/${associationId}`, {
                headers: this.getHeader()
            });
            return response.data;  // Response from the backend
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to retrieve volunteers"
            };
        }
    }

    /** GET ASSOCIATION INFO */

    // Get association info by its ID
    static async getAssociationById(associationId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/association/${associationId}`, {
                headers: this.getHeader()
            });
            return response.data;  // Response from the backend
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to retrieve association info"
            };
        }
    }

    /** CREATE SESSIONS */

    // Create sessions for an association
    static async createSessions(sessionDTOList) {
        try {
            const response = await axios.post(`${this.BASE_URL}/session/create`, sessionDTOList, {
                headers: this.getHeader()
            });
            return response.data;  // Response from the backend
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to create sessions"
            };
        }
    }

    /** UPDATE SESSION */

    // Update a specific session
    static async updateSession(sessionId, sessionDTO) {
        try {
            const response = await axios.post(`${this.BASE_URL}/session/update/${sessionId}`, sessionDTO, {
                headers: this.getHeader()
            });
            return response.data;  // Response from the backend
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to update session"
            };
        }
    }

    /** GET SESSION BY ID */

    // Get details of a specific session by its ID
    static async getSessionById(sessionId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/session/${sessionId}`, {
                headers: this.getHeader()
            });
            return response.data;  // Response from the backend
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to retrieve session"
            };
        }
    }

    /** GET ALL SESSIONS */

    // Get all sessions (for Admin)
    static async getAllSessions() {
        try {
            const response = await axios.get(`${this.BASE_URL}/session/all`, {
                headers: this.getHeader()
            });
            return response.data;  // Response from the backend
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to retrieve sessions"
            };
        }
    }

    /** UPDATE AVAILABLE DAYS */

    static async updateAvailableDays(volunteerId,availableDays) {
        try {
            const response = await axios.post(`${this.BASE_URL}/volunteer/available-days/${volunteerId}`, availableDays, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status:500,
                message: error.response ? error.response.data.message : "Failed to update available days"
            };
        }
    }

    static async getSession(volunteerId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/volunteer/sessions/${volunteerId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to update available days"
            };
        }
    }

    static async getVolunteerById(volunteerId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/volunteer/${volunteerId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to update available days"
            };
        }
    }

    static async createRequest(dto) {
        try {
            const response = await axios.post(`${this.BASE_URL}/volunteer-requests/create`,dto, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to update available days"
            };
        }
    }

    static async updateStatus(updateRequestStatusDTO) {
        try {
            const response = await axios.post(`${this.BASE_URL}/volunteer-requests/create`,updateRequestStatusDTO, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to update available days"
            };
        }
    }

    static async getAllRequests(updateRequestStatusDTO) {
        try {
            const response = await axios.get(`${this.BASE_URL}/volunteer-requests/all`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to update available days"
            };
        }
    }

    static async getByAssociation(associationId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/volunteer-requests/association/${associationId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            return {
                status: 500,
                message: error.response ? error.response.data.message : "Failed to update available days"
            };
        }
    }
}
