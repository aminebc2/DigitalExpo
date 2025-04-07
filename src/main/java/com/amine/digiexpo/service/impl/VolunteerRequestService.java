package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.VolunteerRequestDTO;
import com.amine.digiexpo.Repository.AssociationRepository;
import com.amine.digiexpo.Repository.VolunteerRepository;
import com.amine.digiexpo.Repository.VolunteerRequestRepository;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.entity.VolunteerRequest;
import com.amine.digiexpo.enumeration.RequestStatus;
import com.amine.digiexpo.service.interfac.IVolunteerRequestService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VolunteerRequestService implements IVolunteerRequestService {

    private final VolunteerRequestRepository volunteerRequestRepository;
    private final VolunteerRepository volunteerRepository;
    private final AssociationRepository associationRepository;

    @Autowired
    public VolunteerRequestService(VolunteerRequestRepository volunteerRequestRepository,
                                   VolunteerRepository volunteerRepository,
                                   AssociationRepository associationRepository) {
        this.volunteerRequestRepository = volunteerRequestRepository;
        this.volunteerRepository = volunteerRepository;
        this.associationRepository = associationRepository;
    }

    @Override
    @PreAuthorize("hasRole('BENEVOLE')")
    public VolunteerRequestDTO createRequest(Long volunteerId, Long associationId) {
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));

        Association association = associationRepository.findById(associationId)
                .orElseThrow(() -> new RuntimeException("Association not found"));

        VolunteerRequest volunteerRequest = new VolunteerRequest();
        volunteerRequest.setVolunteer(volunteer);
        volunteerRequest.setAssociation(association);
        volunteerRequest.setStatus(RequestStatus.PENDING);

        VolunteerRequest savedRequest = volunteerRequestRepository.save(volunteerRequest);
        return Utils.mapVolunteerRequestEntityToVolunteerRequestDTOWithRelations(savedRequest);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public VolunteerRequestDTO updateRequestStatus(Long requestId, RequestStatus status) {
        VolunteerRequest volunteerRequest = volunteerRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Volunteer request not found"));

        volunteerRequest.setStatus(status);

        if (status == RequestStatus.APPROVED) {
            Volunteer volunteer = volunteerRequest.getVolunteer();
            Association association = volunteerRequest.getAssociation();

            association.getVolunteers().add(volunteer);
            volunteer.getAssociations().add(association);

            associationRepository.save(association);
            volunteerRepository.save(volunteer);
        }

        VolunteerRequest updatedRequest = volunteerRequestRepository.save(volunteerRequest);
        return Utils.mapVolunteerRequestEntityToVolunteerRequestDTOWithRelations(updatedRequest);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<VolunteerRequestDTO> getAllRequests() {
        List<VolunteerRequest> requests = volunteerRequestRepository.findAll();
        return Utils.mapVolunteerRequestListEntityToVolunteerRequestListDTO(requests);
    }

    @Override
    @PreAuthorize("hasRole('ASSOCIATION')")
    public List<VolunteerRequestDTO> getRequestsByAssociation(Long associationId) {
        if (!associationRepository.existsById(associationId)) {
            throw new RuntimeException("Association not found");
        }

        List<VolunteerRequest> requests = volunteerRequestRepository.findByAssociationId(associationId);
        return Utils.mapVolunteerRequestListEntityToVolunteerRequestListDTO(requests);
    }
}