package com.amine.digiexpo.utils;

import com.amine.digiexpo.DTO.*;
import com.amine.digiexpo.entity.*;
import com.amine.digiexpo.enumeration.SessionStatus;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Utils {

    private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom secureRandom = new SecureRandom();

    // Generates a random alphanumeric code of the given length
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
        dto.setPassword(user.getPassword());
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
        dto.setPhoneNumber(admin.getPhoneNumber());
        dto.setFullName(admin.getPhoneNumber());
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
        dto.setImageFileName(association.getImageFileName());
        return dto;
    }

    public static AssociationDTO mapToAssociationDTO(Association association) {
        AssociationDTO dto = new AssociationDTO();
        dto.setId(association.getId());
        dto.setRole(association.getRole());
        dto.setName(association.getName());
        dto.setEmail(association.getEmail());
        dto.setVille(association.getVille());
        dto.setResponsableName(association.getResponsableName());
        dto.setResponsablePhone(association.getResponsablePhone());
        dto.setImageFileName(association.getImageFileName());
        // You can include additional fields here
        return dto;
    }

    public static List<AssociationDTO> mapToAssociationDTOList(List<Association> associations) {
        return associations.stream()
                .map(Utils::mapToAssociationDTO)
                .collect(Collectors.toList());
    }

    public static VolunteerDTO mapVolunteerToDTO(Volunteer volunteer) {
        if (volunteer == null) return null;
        VolunteerDTO dto = new VolunteerDTO();
        dto.setId(volunteer.getId());
        dto.setUsername(volunteer.getUsername());
        dto.setPassword(volunteer.getPassword());
        dto.setEmail(volunteer.getEmail());
        dto.setRole(volunteer.getRole());
        dto.setPhoneNumber(volunteer.getPhoneNumber());
        dto.setFullName(volunteer.getFullName());
        dto.setAvailableDays(volunteer.getAvailableDays());
        return dto;
    }

    // ----------- SESSION MAPPING -----------

    public static SessionDTO mapSessionToDTO(Session session) {
        SessionDTO dto = new SessionDTO();
        dto.setId(session.getId());
        dto.setDate(session.getDate());
        dto.setStatus(session.getStatus());
        return dto;
    }

    public static SessionDTO mapSessionToDTOWithAssociationDetails(Session session) {
        SessionDTO dto = new SessionDTO();
        dto.setId(session.getId());
        dto.setDate(session.getDate());
        dto.setStatus(session.getStatus());

        // Add association details to the DTO
        if (session.getAssociation() != null) {
            AssociationDTO associationDTO = new AssociationDTO();
            associationDTO.setId(session.getAssociation().getId());
            associationDTO.setEmail(session.getAssociation().getEmail());
            associationDTO.setName(session.getAssociation().getName());
            associationDTO.setResponsableName(session.getAssociation().getResponsableName());
            associationDTO.setResponsablePhone(session.getAssociation().getResponsablePhone());
            associationDTO.setImageFileName(session.getAssociation().getImageFileName());
            dto.setAssociation(associationDTO);
        }

        return dto;
    }

    public static SessionDTO mapSessionToDTOWithRelations(Session session) {
        SessionDTO dto = new SessionDTO();
        dto.setId(session.getId());
        dto.setDate(session.getDate());
        dto.setStatus(session.getStatus());

        // association with only id and name
        if (session.getAssociation() != null) {
            AssociationDTO assocDTO = new AssociationDTO();
            assocDTO.setId(session.getAssociation().getId());
            assocDTO.setName(session.getAssociation().getName());
            dto.setAssociation(assocDTO);
        }

        // volunteer with only id and username
        if (session.getVolunteer() != null) {
            VolunteerDTO volDTO = new VolunteerDTO();
            volDTO.setId(session.getVolunteer().getId());
            volDTO.setUsername(session.getVolunteer().getUsername());
            volDTO.setFullName(session.getVolunteer().getFullName());
            dto.setVolunteer(volDTO);
        }

        return dto;
    }

    public static List<SessionDTO> mapSessionListToDTOListWithVolunteerDetails(List<Session> sessions) {
        List<SessionDTO> sessionDTOList = new ArrayList<>();

        for (Session session : sessions) {
            SessionDTO sessionDTO = new SessionDTO();
            sessionDTO.setId(session.getId());
            sessionDTO.setDate(session.getDate());
            sessionDTO.setStatus(session.getStatus());

            if (session.getVolunteer() != null) {
                VolunteerDTO volunteerDTO = new VolunteerDTO(
                        session.getVolunteer().getUsername(),
                        session.getVolunteer().getEmail(),
                        session.getVolunteer().getPhoneNumber(),
                        session.getVolunteer().getFullName());

                sessionDTO.setVolunteer(volunteerDTO);
            } else {
                System.out.println("No volunteer assigned for session ID: " + session.getId());
            }

            sessionDTOList.add(sessionDTO);
        }

        return sessionDTOList;
    }



    // ----------- VOLUNTEER REQUEST MAPPING -----------

    public static VolunteerRequestDTO mapVolunteerRequestToDTO(VolunteerRequest volunteerRequest) {
        if (volunteerRequest == null) return null;

        VolunteerRequestDTO dto = new VolunteerRequestDTO();
        dto.setId(volunteerRequest.getId());
        dto.setStatus(volunteerRequest.getStatus());


        if (volunteerRequest.getVolunteer() != null) {
            dto.setVolunteer(mapVolunteerToDTO(volunteerRequest.getVolunteer()));
        }

        if (volunteerRequest.getAssociation() != null) {
            dto.setAssociation(mapAssociationToDTO(volunteerRequest.getAssociation()));
        }

        return dto;
    }

    public static VolunteerRequestDTO mapVolunteerRequestToDTOWithRelations(VolunteerRequest request) {
        if (request == null) return null;

        VolunteerRequestDTO dto = mapVolunteerRequestToDTO(request);

        dto.setVolunteer(mapVolunteerToDTO(request.getVolunteer()));
        dto.setAssociation(mapAssociationToDTO(request.getAssociation()));

        return dto;
    }

    // ----------- RELATIONAL MAPPING -----------

    public static VolunteerDTO mapVolunteerToDTOWithRelations(Volunteer volunteer) {
        if (volunteer == null) return null;

        VolunteerDTO dto = mapVolunteerToDTO(volunteer); // basic mapping

        // Ensure associations are not null
        if (volunteer.getAssociations() != null) {
            dto.setAssociations(volunteer.getAssociations().stream()
                    .map(Utils::mapAssociationToDTO)
                    .collect(Collectors.toList()));
        }

        // Ensure sessions are not null
        if (volunteer.getSessions() != null) {
            dto.setSessions(volunteer.getSessions().stream()
                    .map(Utils::mapSessionToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public static SessionDTO convertSessionToDTO(Session session) {
        if (session == null) return null;

        SessionDTO dto = new SessionDTO();

        // Set basic fields
        dto.setId(session.getId());
        dto.setDate(session.getDate());
        dto.setStatus(session.getStatus() != null ? session.getStatus() : SessionStatus.PENDING);

        // Set association if exists
        if (session.getAssociation() != null) {
            AssociationDTO associationDTO = new AssociationDTO();
            Association association = session.getAssociation();
            associationDTO.setId(association.getId());
            associationDTO.setUsername(association.getUsername());
            associationDTO.setEmail(association.getEmail());
            associationDTO.setRole(association.getRole());
            associationDTO.setName(association.getName());
            associationDTO.setVille(association.getVille());
            associationDTO.setResponsableName(association.getResponsableName());
            associationDTO.setResponsablePhone(association.getResponsablePhone());
            associationDTO.setImageFileName(association.getImageFileName());
            dto.setAssociation(associationDTO);
        }

        // Set volunteer if exists
        if (session.getVolunteer() != null) {
            VolunteerDTO volunteerDTO = new VolunteerDTO();
            Volunteer volunteer = session.getVolunteer();
            volunteerDTO.setId(volunteer.getId());
            volunteerDTO.setUsername(volunteer.getUsername());
            volunteerDTO.setEmail(volunteer.getEmail());
            volunteerDTO.setRole(volunteer.getRole());
            volunteerDTO.setPhoneNumber(volunteer.getPhoneNumber());
            volunteerDTO.setFullName(volunteer.getFullName());
            volunteerDTO.setAvailableDays(volunteer.getAvailableDays());
            dto.setVolunteer(volunteerDTO);
        }

        return dto;
    }

    // Add a list version for convenience
    public static List<SessionDTO> convertSessionListToDTO(List<Session> sessions) {
        if (sessions == null) return new ArrayList<>();
        return sessions.stream()
                .map(Utils::convertSessionToDTO)
                .collect(Collectors.toList());
    }


    public static AssociationDTO mapAssociationToDTOWithRelations(Association association) {
        AssociationDTO dto = new AssociationDTO();
        dto.setId(association.getId());
        dto.setUsername(association.getUsername());
        dto.setEmail(association.getEmail());
        dto.setRole(association.getRole());
        dto.setName(association.getName());
        dto.setVille(association.getVille());
        dto.setResponsableName(association.getResponsableName());
        dto.setResponsablePhone(association.getResponsablePhone());
        dto.setImageFileName(association.getImageFileName());
        // Mapping des sessions
        if (association.getSessions() != null) {
            List<SessionDTO> sessionDTOs = association.getSessions()
                    .stream()
                    .map(Utils::mapSessionToDTO)
                    .collect(Collectors.toList());
            dto.setSessions(sessionDTOs);
        }

        // Mapping des volunteers
        if (association.getVolunteers() != null) {
            List<VolunteerDTO> volunteerDTOs = association.getVolunteers()
                    .stream()
                    .map(Utils::mapVolunteerToDTO)
                    .collect(Collectors.toList());
            dto.setVolunteers(volunteerDTOs);
        }

        return dto;
    }




    // ----------- LIST MAPPING -----------

    public static List<UserDTO> mapUserListToDTOList(List<User> users) {
        return users.stream().map(Utils::mapUserToDTO).collect(Collectors.toList());
    }

    public static List<AdminDTO> mapAdminListToDTOList(List<Admin> admins) {
        return admins.stream().map(Utils::mapAdminToDTO).collect(Collectors.toList());
    }

    public static List<VolunteerDTO> mapVolunteerListToDTOList(List<Volunteer> volunteers) {
        return volunteers.stream().map(Utils::mapVolunteerToDTO).collect(Collectors.toList());
    }


    public static List<AssociationDTO> mapAssociationListToDTOList(List<Association> associations) {
        return associations.stream().map(Utils::mapAssociationToDTO).collect(Collectors.toList());
    }

    public static List<SessionDTO> mapSessionListToDTOList(List<Session> sessions) {
        return sessions.stream()
                .map(Utils::mapSessionToDTOWithRelations)
                .collect(Collectors.toList());
    }

    public static List<SessionDTO> mapSessionListToDTOListWithAssociationDetails(List<Session> sessions) {
        return sessions.stream()
                .map(Utils::mapSessionToDTOWithAssociationDetails)
                .collect(Collectors.toList());
    }

    public static List<VolunteerRequestDTO> mapVolunteerRequestListToDTOList(List<VolunteerRequest> requests) {
        return requests.stream().map(Utils::mapVolunteerRequestToDTO).collect(Collectors.toList());
    }
}