package com.amine.digiexpo.utils;

import com.amine.digiexpo.DTO.*;
import com.amine.digiexpo.entity.*;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

public class Utils {

    private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom secureRandom = new SecureRandom();

    // Random code generator for potential use with request confirmations or session IDs
    public static String generateRandomCode(int length) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(ALPHANUMERIC_STRING.length());
            char randomChar = ALPHANUMERIC_STRING.charAt(randomIndex);
            stringBuilder.append(randomChar);
        }
        return stringBuilder.toString();
    }

    // User mapping methods
    public static UserDTO mapUserEntityToUserDTO(User user) {
        if (user == null) return null;

        UserDTO userDTO;

        if (user instanceof Admin) {
            userDTO = new AdminDTO();
        } else if (user instanceof Association) {
            Association association = (Association) user;
            AssociationDTO associationDTO = new AssociationDTO();

            associationDTO.setName(association.getName());
            associationDTO.setVille(association.getVille());
            associationDTO.setResponsableName(association.getResponsableName());
            associationDTO.setResponsablePhone(association.getResponsablePhone());

            userDTO = associationDTO;
        } else if (user instanceof Volunteer) {
            Volunteer volunteer = (Volunteer) user;
            VolunteerDTO volunteerDTO = new VolunteerDTO();

            volunteerDTO.setPhoneNumber(volunteer.getPhoneNumber());
            volunteerDTO.setAvailableDays(volunteer.getAvailableDays());

            userDTO = volunteerDTO;
        } else {
            userDTO = new UserDTO();
        }

        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());

        return userDTO;
    }

    // Session mapping methods
    public static SessionDTO mapSessionEntityToSessionDTO(Session session) {
        if (session == null) return null;

        SessionDTO sessionDTO = new SessionDTO();
        sessionDTO.setId(session.getId());
        sessionDTO.setDate(session.getDate());
        sessionDTO.setStatus(session.getStatus());

        return sessionDTO;
    }

    // Volunteer mapping methods
    public static VolunteerDTO mapVolunteerEntityToVolunteerDTO(Volunteer volunteer) {
        if (volunteer == null) return null;

        VolunteerDTO volunteerDTO = new VolunteerDTO();
        volunteerDTO.setId(volunteer.getId());
        volunteerDTO.setUsername(volunteer.getUsername());
        volunteerDTO.setEmail(volunteer.getEmail());
        volunteerDTO.setRole(volunteer.getRole());
        volunteerDTO.setPhoneNumber(volunteer.getPhoneNumber());
        volunteerDTO.setAvailableDays(volunteer.getAvailableDays());

        return volunteerDTO;
    }

    // Association mapping methods
    public static AssociationDTO mapAssociationEntityToAssociationDTO(Association association) {
        if (association == null) return null;

        AssociationDTO associationDTO = new AssociationDTO();
        associationDTO.setId(association.getId());
        associationDTO.setUsername(association.getUsername());
        associationDTO.setEmail(association.getEmail());
        associationDTO.setRole(association.getRole());
        associationDTO.setName(association.getName());
        associationDTO.setVille(association.getVille());
        associationDTO.setResponsableName(association.getResponsableName());
        associationDTO.setResponsablePhone(association.getResponsablePhone());

        return associationDTO;
    }

    // VolunteerRequest mapping methods
    public static VolunteerRequestDTO mapVolunteerRequestEntityToVolunteerRequestDTO(VolunteerRequest volunteerRequest) {
        if (volunteerRequest == null) return null;

        VolunteerRequestDTO volunteerRequestDTO = new VolunteerRequestDTO();
        volunteerRequestDTO.setId(volunteerRequest.getId());
        volunteerRequestDTO.setStatus(volunteerRequest.getStatus());

        return volunteerRequestDTO;
    }

    // Advanced mapping methods with relationships
    public static SessionDTO mapSessionEntityToSessionDTOWithRelations(Session session) {
        if (session == null) return null;

        SessionDTO sessionDTO = mapSessionEntityToSessionDTO(session);

        if (session.getAssociation() != null) {
            sessionDTO.setAssociation(mapAssociationEntityToAssociationDTO(session.getAssociation()));
        }

        if (session.getVolunteer() != null) {
            sessionDTO.setVolunteer(mapVolunteerEntityToVolunteerDTO(session.getVolunteer()));
        }

        return sessionDTO;
    }

    public static VolunteerDTO mapVolunteerEntityToVolunteerDTOWithRelations(Volunteer volunteer) {
        if (volunteer == null) return null;

        VolunteerDTO volunteerDTO = mapVolunteerEntityToVolunteerDTO(volunteer);

        if (volunteer.getAssociations() != null) {
            volunteerDTO.setAssociations(volunteer.getAssociations().stream()
                    .map(Utils::mapAssociationEntityToAssociationDTO)
                    .collect(Collectors.toList()));
        }

        if (volunteer.getSessions() != null) {
            volunteerDTO.setSessions(volunteer.getSessions().stream()
                    .map(Utils::mapSessionEntityToSessionDTO)
                    .collect(Collectors.toList()));
        }

        return volunteerDTO;
    }

    public static AssociationDTO mapAssociationEntityToAssociationDTOWithRelations(Association association) {
        if (association == null) return null;

        AssociationDTO associationDTO = mapAssociationEntityToAssociationDTO(association);

        if (association.getVolunteers() != null) {
            associationDTO.setVolunteers(association.getVolunteers().stream()
                    .map(Utils::mapVolunteerEntityToVolunteerDTO)
                    .collect(Collectors.toList()));
        }

        if (association.getSessions() != null) {
            associationDTO.setSessions(association.getSessions().stream()
                    .map(Utils::mapSessionEntityToSessionDTO)
                    .collect(Collectors.toList()));
        }

        return associationDTO;
    }

    public static VolunteerRequestDTO mapVolunteerRequestEntityToVolunteerRequestDTOWithRelations(VolunteerRequest volunteerRequest) {
        if (volunteerRequest == null) return null;

        VolunteerRequestDTO volunteerRequestDTO = mapVolunteerRequestEntityToVolunteerRequestDTO(volunteerRequest);

        if (volunteerRequest.getVolunteer() != null) {
            volunteerRequestDTO.setVolunteer(mapVolunteerEntityToVolunteerDTO(volunteerRequest.getVolunteer()));
        }

        if (volunteerRequest.getAssociation() != null) {
            volunteerRequestDTO.setAssociation(mapAssociationEntityToAssociationDTO(volunteerRequest.getAssociation()));
        }

        return volunteerRequestDTO;
    }

    // List mapping methods
    public static List<UserDTO> mapUserListEntityToUserListDTO(List<User> userList) {
        return userList.stream().map(Utils::mapUserEntityToUserDTO).collect(Collectors.toList());
    }

    public static List<VolunteerDTO> mapVolunteerListEntityToVolunteerListDTO(List<Volunteer> volunteerList) {
        return volunteerList.stream().map(Utils::mapVolunteerEntityToVolunteerDTO).collect(Collectors.toList());
    }

    public static List<AssociationDTO> mapAssociationListEntityToAssociationListDTO(List<Association> associationList) {
        return associationList.stream().map(Utils::mapAssociationEntityToAssociationDTO).collect(Collectors.toList());
    }

    public static List<SessionDTO> mapSessionListEntityToSessionListDTO(List<Session> sessionList) {
        return sessionList.stream().map(Utils::mapSessionEntityToSessionDTO).collect(Collectors.toList());
    }

    public static List<VolunteerRequestDTO> mapVolunteerRequestListEntityToVolunteerRequestListDTO(List<VolunteerRequest> volunteerRequestList) {
        return volunteerRequestList.stream().map(Utils::mapVolunteerRequestEntityToVolunteerRequestDTO).collect(Collectors.toList());
    }
}