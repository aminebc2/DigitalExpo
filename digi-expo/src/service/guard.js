import { Navigate } from "react-router-dom";
import ApiService from "./ApiService"; // Update path if different

// Route guard to check authentication
export function PrivateRoute({ children }) {
    const isAuthenticated = ApiService.isAuthenticated();
    return isAuthenticated ? children : <Navigate to="/login" />;
}

// Route guard to restrict access to admins only
export function AdminRoute({ children }) {
    const user = ApiService.getCurrentUser();
    const isAdmin = user && user.role === "ADMIN"; // Adjust role name if necessary
    return isAdmin ? children : <Navigate to="/unauthorized" />;
}

// Route guard for volunteers
export function VolunteerRoute({ children }) {
    const user = ApiService.getCurrentUser();
    const isVolunteer = user && user.role === "BENEVOLE"; // Adjust role name if necessary
    return isVolunteer ? children : <Navigate to="/unauthorized" />;
}

// Route guard for associations
export function AssociationRoute({ children }) {
    const user = ApiService.getCurrentUser();
    const isAssociation = user && user.role === "ASSOCIATION"; // Adjust role name if necessary
    return isAssociation ? children : <Navigate to="/unauthorized" />;
}
