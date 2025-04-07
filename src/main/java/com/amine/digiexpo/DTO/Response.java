package com.amine.digiexpo.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int statusCode;
    private String message;

    // For authentication
    private String token;
    private String role;
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
}
