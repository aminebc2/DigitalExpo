package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.*;
import com.amine.digiexpo.enumeration.SessionStatus;

import java.time.LocalDate;
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
    /*Response validateVolunteerRequest(Long requestId);*/
    Response updateRequestStatus(UpdateRequestStatusDTO updateRequestStatusDTO);
    Response getAllRequests();


    // Confirmer une session
    Response confirmSession(Long sessionId, SessionStatus status);

    // Mettre à jour une session (ex: assigner un bénévole ou confirmer)
    Response updateSession(Long sessionId, SessionStatusUpdateDTO sessionStatusUpdateDTO);
    Response getSessionById(Long sessionId);
    // Récupérer toutes les sessions
    Response getAllSessions();

    // Method to assign a volunteer to a session
    Response assignVolunteerToSession(Long sessionId, Long volunteerId);
    Response getVolunteers(Long associationId);
}