package com.amine.digiexpo.utils;

import com.amine.digiexpo.DTO.*;
import com.amine.digiexpo.entity.*;

import java.security.SecureRandom;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Utils {

    private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom secureRandom = new SecureRandom();

    public static String generateRandomCode(int length) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = secureRandom.nextInt(ALPHANUMERIC_STRING.length());
            builder.append(ALPHANUMERIC_STRING.charAt(index));
        }
        return builder.toString();
    }

    // ----------- USER MAPPING -----------

    public static UserDTO mapUserToDTO(User user) {
        if (user == null) return null;

        if (user instanceof Admin) return mapAdminToDTO((Admin) user);
        if (user instanceof Association) return mapAssociationToDTO((Association) user);
        if (user instanceof Volunteer) return mapVolunteerToDTO((Volunteer) user);

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }

    public static AdminDTO mapAdminToDTO(Admin admin) {
        if (admin == null) return null;
        AdminDTO dto = new AdminDTO();
        dto.setId(admin.getId());
        dto.setUsername(admin.getUsername());
        dto.setEmail(admin.getEmail());
        dto.setRole(admin.getRole());
        return dto;
    }

    public static AssociationDTO mapAssociationToDTO(Association association) {
        if (association == null) return null;

        AssociationDTO dto = new AssociationDTO();
        dto.setId(association.getId());
        dto.setUsername(association.getUsername());
        dto.setEmail(association.getEmail());
        dto.setRole(association.getRole());
        dto.setName(association.getName());
        dto.setVille(association.getVille());
        dto.setResponsableName(association.getResponsableName());
        dto.setResponsablePhone(association.getResponsablePhone());
        return dto;
    }

    public static VolunteerDTO mapVolunteerToDTO(Volunteer volunteer) {
        if (volunteer == null) return null;

        VolunteerDTO dto = new VolunteerDTO();
        dto.setId(volunteer.getId());
        dto.setUsername(volunteer.getUsername());
        dto.setEmail(volunteer.getEmail());
        dto.setRole(volunteer.getRole());
        dto.setPhoneNumber(volunteer.getPhoneNumber());
        dto.setAvailableDays(volunteer.getAvailableDays());
        return dto;
    }

    // ----------- SESSION MAPPING -----------

    public static SessionDTO mapSessionToDTO(Session session) {
        if (session == null) return null;

        SessionDTO dto = new SessionDTO();
        dto.setId(session.getId());
        dto.setDate(session.getDate());
        dto.setStatus(session.getStatus());
        return dto;
    }

    public static SessionDTO mapSessionToDTOWithRelations(Session session) {
        SessionDTO dto = mapSessionToDTO(session);
        dto.setAssociation(mapAssociationToDTO(session.getAssociation()));
        dto.setVolunteer(mapVolunteerToDTO(session.getVolunteer()));
        return dto;
    }

    // ----------- VOLUNTEER REQUEST MAPPING -----------

    public static VolunteerRequestDTO mapVolunteerRequestToDTO(VolunteerRequest request) {
        if (request == null) return null;

        VolunteerRequestDTO dto = new VolunteerRequestDTO();
        dto.setId(request.getId());
        dto.setStatus(request.getStatus());
        return dto;
    }

    public static VolunteerRequestDTO mapVolunteerRequestToDTOWithRelations(VolunteerRequest request) {
        VolunteerRequestDTO dto = mapVolunteerRequestToDTO(request);
        dto.setVolunteer(mapVolunteerToDTO(request.getVolunteer()));
        dto.setAssociation(mapAssociationToDTO(request.getAssociation()));
        return dto;
    }

    // ----------- RELATIONAL MAPPING -----------

    public static VolunteerDTO mapVolunteerToDTOWithRelations(Volunteer volunteer) {
        VolunteerDTO dto = mapVolunteerToDTO(volunteer);

        if (volunteer.getAssociations() != null) {
            dto.setAssociations(volunteer.getAssociations().stream()
                    .map(Utils::mapAssociationToDTO)
                    .collect(Collectors.toList()));
        }

        if (volunteer.getSessions() != null) {
            dto.setSessions(volunteer.getSessions().stream()
                    .map(Utils::mapSessionToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public static AssociationDTO mapAssociationToDTOWithRelations(Association association) {
        AssociationDTO dto = mapAssociationToDTO(association);

        if (association.getVolunteers() != null) {
            dto.setVolunteers(association.getVolunteers().stream()
                    .map(Utils::mapVolunteerToDTO)
                    .collect(Collectors.toList()));
        }

        if (association.getSessions() != null) {
            dto.setSessions(association.getSessions().stream()
                    .map(Utils::mapSessionToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    // ----------- LIST MAPPING -----------

    public static List<UserDTO> mapUserListToDTOList(List<User> users) {
        return users.stream().map(Utils::mapUserToDTO).collect(Collectors.toList());
    }

    public static List<VolunteerDTO> mapVolunteerListToDTOList(List<Volunteer> volunteers) {
        return volunteers.stream().map(Utils::mapVolunteerToDTO).collect(Collectors.toList());
    }

    public static List<AssociationDTO> mapAssociationListToDTOList(List<Association> associations) {
        return associations.stream().map(Utils::mapAssociationToDTO).collect(Collectors.toList());
    }

    public static List<SessionDTO> mapSessionListToDTOList(List<Session> sessions) {
        return sessions.stream().map(Utils::mapSessionToDTO).collect(Collectors.toList());
    }

    public static List<VolunteerRequestDTO> mapVolunteerRequestListToDTOList(List<VolunteerRequest> requests) {
        return requests.stream().map(Utils::mapVolunteerRequestToDTO).collect(Collectors.toList());
    }
}