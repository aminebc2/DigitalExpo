package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.AssociationDTO;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;

import java.time.LocalDate;
import java.util.List;

public interface IAssociationService {
    // Réserver une session un jour par semaine
    SessionDTO reserveSession(Long associationId, LocalDate date);

    // Consulter la liste des réservations (sessions)
    List<SessionDTO> getSessions(Long associationId);

    // Consulter la liste des bénévoles
    List<VolunteerDTO> getVolunteers(Long associationId);

    // Récupérer les détails de l'association
    AssociationDTO getAssociationById(Long associationId);
}
