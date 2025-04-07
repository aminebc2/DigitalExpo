package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.AssociationDTO;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;

import java.util.List;

public interface IAdminService {

    // Gérer les associations (CRUD)
    AssociationDTO createAssociation(AssociationDTO associationDTO);
    AssociationDTO updateAssociation(Long associationId, AssociationDTO associationDTO);
    void deleteAssociation(Long associationId);
    List<AssociationDTO> getAllAssociations();

    // Gérer les bénévoles (CRUD)
    VolunteerDTO createVolunteer(VolunteerDTO volunteerDTO);
    VolunteerDTO updateVolunteer(Long volunteerId, VolunteerDTO volunteerDTO);
    void deleteVolunteer(Long volunteerId);
    List<VolunteerDTO> getAllVolunteers();

    // Valider la demande d’un bénévole
    void validateVolunteerRequest(Long requestId);

    // Confirmer une session
    SessionDTO confirmSession(Long sessionId);
}
