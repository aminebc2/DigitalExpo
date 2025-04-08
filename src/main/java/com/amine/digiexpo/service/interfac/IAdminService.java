package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.AssociationDTO;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;

import java.util.List;

public interface IAdminService {

    // Gérer les associations (CRUD)
    Response createAssociation(AssociationDTO associationDTO);
    Response updateAssociation(Long associationId, AssociationDTO associationDTO);
    Response deleteAssociation(Long associationId);
    Response getAllAssociations();

    // Gérer les bénévoles (CRUD)
    Response createVolunteer(VolunteerDTO volunteerDTO);
    Response updateVolunteer(Long volunteerId, VolunteerDTO volunteerDTO);
    Response deleteVolunteer(Long volunteerId);
    Response getAllVolunteers();

    // Valider la demande d’un bénévole
    Response validateVolunteerRequest(Long requestId);

    // Confirmer une session
    Response confirmSession(Long sessionId);
}
