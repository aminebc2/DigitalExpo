package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.Response;
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
    public Response createRequest(Long volunteerId, Long associationId) {
        try {
            // Retrieve the volunteer and association
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            // Create the request
            VolunteerRequest volunteerRequest = new VolunteerRequest();
            volunteerRequest.setVolunteer(volunteer);
            volunteerRequest.setAssociation(association);
            volunteerRequest.setStatus(RequestStatus.PENDING);

            // Save the request
            VolunteerRequest savedRequest = volunteerRequestRepository.save(volunteerRequest);

            // Return success response
            return new Response(201, "Request created successfully", Utils.mapVolunteerRequestToDTOWithRelations(savedRequest));
        } catch (Exception e) {
            // Handle errors and return failure response
            return new Response(500, "Failed to create request: " + e.getMessage(), null);
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Response updateRequestStatus(Long requestId, RequestStatus status) {
        try {
            // Retrieve the request
            VolunteerRequest volunteerRequest = volunteerRequestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Volunteer request not found"));

            // Update the request status
            volunteerRequest.setStatus(status);

            if (status == RequestStatus.APPROVED) {
                Volunteer volunteer = volunteerRequest.getVolunteer();
                Association association = volunteerRequest.getAssociation();

                // Add the volunteer to the association
                association.getVolunteers().add(volunteer);
                volunteer.getAssociations().add(association);

                // Save updated association and volunteer
                associationRepository.save(association);
                volunteerRepository.save(volunteer);
            }

            // Save and return the updated request
            VolunteerRequest updatedRequest = volunteerRequestRepository.save(volunteerRequest);
            return new Response(200, "Request updated successfully", Utils.mapVolunteerRequestToDTOWithRelations(updatedRequest));
        } catch (Exception e) {
            // Handle errors and return failure response
            return new Response(500, "Failed to update request: " + e.getMessage(), null);
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Response getAllRequests() {
        try {
            // Retrieve all requests
            List<VolunteerRequest> requests = volunteerRequestRepository.findAll();

            // Return success response with list of requests
            return new Response(200, "Requests retrieved successfully", Utils.mapVolunteerRequestListToDTOList(requests));
        } catch (Exception e) {
            // Handle errors and return failure response
            return new Response(500, "Failed to retrieve requests: " + e.getMessage(), null);
        }
    }

    @Override
    @PreAuthorize("hasRole('ASSOCIATION')")
    public Response getRequestsByAssociation(Long associationId) {
        try {
            // Check if the association exists
            if (!associationRepository.existsById(associationId)) {
                throw new RuntimeException("Association not found");
            }

            // Retrieve the requests for the specific association
            List<VolunteerRequest> requests = volunteerRequestRepository.findByAssociationId(associationId);

            // Return success response with list of requests
            return new Response(200, "Requests retrieved successfully", Utils.mapVolunteerRequestListToDTOList(requests));
        } catch (Exception e) {
            // Handle errors and return failure response
            return new Response(500, "Failed to retrieve requests: " + e.getMessage(), null);
        }
    }
}
