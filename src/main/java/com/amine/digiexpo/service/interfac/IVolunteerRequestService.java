package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.UpdateRequestStatusDTO;
import com.amine.digiexpo.DTO.VolunteerRequestDTO;
import com.amine.digiexpo.enumeration.RequestStatus;

import java.util.List;

public interface IVolunteerRequestService {
    // Envoyer une demande pour rejoindre une association
    Response createRequest(VolunteerRequestDTO dto);

    /*// Valider ou rejeter une demande (utilisé par Admin)
    Response updateRequestStatus(UpdateRequestStatusDTO updateRequestStatusDTO);

    // Consulter toutes les demandes (pour Admin)
    Response getAllRequests();*/

    // Consulter les demandes d'une association spécifique
    Response getRequestsByAssociation(Long associationId);
}
