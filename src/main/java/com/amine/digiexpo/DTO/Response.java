package com.amine.digiexpo.DTO;

import com.amine.digiexpo.enumeration.Role;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int statusCode;
    private String message;
    private Object data;

    public Response() {
    }

    public Response(int statusCode, String message, Object data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }// Pour retourner des données optionnelles

    // For authentication
    private String token;
    private Role role;
    private String expirationTime;

    // Single objects
    private UserDTO user;
    private AssociationDTO association;
    private VolunteerDTO volunteer;
    private SessionDTO session;
    private VolunteerRequestDTO volunteerRequest;

    // Lists
    private List<UserDTO> userList;
    private List<AssociationDTO> associationList;
    private List<VolunteerDTO> volunteerList;
    private List<SessionDTO> sessionList;
    private List<VolunteerRequestDTO> volunteerRequestList;

    public Response(int value, String message, String token, Role role, UserDTO userDTO) {
        this.statusCode = value;
        this.message = message;
        this.token = token;
        this.role = role;
        this.user = userDTO;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(String expirationTime) {
        this.expirationTime = expirationTime;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public AssociationDTO getAssociation() {
        return association;
    }

    public void setAssociation(AssociationDTO association) {
        this.association = association;
    }

    public VolunteerDTO getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(VolunteerDTO volunteer) {
        this.volunteer = volunteer;
    }

    public SessionDTO getSession() {
        return session;
    }

    public void setSession(SessionDTO session) {
        this.session = session;
    }

    public VolunteerRequestDTO getVolunteerRequest() {
        return volunteerRequest;
    }

    public void setVolunteerRequest(VolunteerRequestDTO volunteerRequest) {
        this.volunteerRequest = volunteerRequest;
    }

    public List<UserDTO> getUserList() {
        return userList;
    }

    public void setUserList(List<UserDTO> userList) {
        this.userList = userList;
    }

    public List<AssociationDTO> getAssociationList() {
        return associationList;
    }

    public void setAssociationList(List<AssociationDTO> associationList) {
        this.associationList = associationList;
    }

    public List<VolunteerDTO> getVolunteerList() {
        return volunteerList;
    }

    public void setVolunteerList(List<VolunteerDTO> volunteerList) {
        this.volunteerList = volunteerList;
    }

    public List<SessionDTO> getSessionList() {
        return sessionList;
    }

    public void setSessionList(List<SessionDTO> sessionList) {
        this.sessionList = sessionList;
    }

    public List<VolunteerRequestDTO> getVolunteerRequestList() {
        return volunteerRequestList;
    }

    public void setVolunteerRequestList(List<VolunteerRequestDTO> volunteerRequestList) {
        this.volunteerRequestList = volunteerRequestList;
    }
}
