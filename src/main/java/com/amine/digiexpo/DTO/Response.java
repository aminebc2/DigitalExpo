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

    // Single objects
    private UserDTO user;
    private AdminDTO admin;
    private AssociationDTO association;
    private VolunteerDTO volunteer;
    private SessionDTO session;
    private VolunteerRequestDTO volunteerRequest;

    // Lists
    private List<UserDTO> userList;
    private List<AdminDTO> adminList;
    private List<AssociationDTO> associationList;
    private List<VolunteerDTO> volunteerList;
    private List<SessionDTO> sessionList;
    private List<VolunteerRequestDTO> volunteerRequestList;

    // Constructors
    public Response() {}

    public Response(int statusCode, String message, Object data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    public Response(int statusCode, String message, List<VolunteerDTO> volunteerList) {
        this.statusCode = statusCode;
        this.message = message;
        this.volunteerList = volunteerList;
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

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public AdminDTO getAdmin() {
        return admin;
    }

    public void setAdmin(AdminDTO admin) {
        this.admin = admin;
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

    public List<AdminDTO> getAdminList() {
        return adminList;
    }

    public void setAdminList(List<AdminDTO> adminList) {
        this.adminList = adminList;
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
