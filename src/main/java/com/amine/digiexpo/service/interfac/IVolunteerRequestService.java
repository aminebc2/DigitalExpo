package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.VolunteerRequestDTO;
import com.amine.digiexpo.enumeration.RequestStatus;

import java.util.List;

public interface IVolunteerRequestService {
    // Envoyer une demande pour rejoindre une association
    VolunteerRequestDTO createRequest(Long volunteerId, Long associationId);

    // Valider ou rejeter une demande (utilisé par Admin)
    VolunteerRequestDTO updateRequestStatus(Long requestId, RequestStatus status);

    // Consulter toutes les demandes (pour Admin)
    List<VolunteerRequestDTO> getAllRequests();

    // Consulter les demandes d'une association spécifique
    List<VolunteerRequestDTO> getRequestsByAssociation(Long associationId);
}
