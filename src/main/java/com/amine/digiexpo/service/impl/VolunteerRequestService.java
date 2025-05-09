package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.UpdateRequestStatusDTO;
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

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VolunteerRequestService implements IVolunteerRequestService {

    @Autowired
    private VolunteerRequestRepository requestRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private AssociationRepository associationRepository;

    @Autowired
    private VolunteerRequestRepository volunteerRequestRepository;

    @Override
    @PreAuthorize("hasRole('BENEVOLE')")
    public Response createRequest(VolunteerRequestDTO dto) {
        try {
            // Retrieve the volunteer and association from the DTO
            Volunteer volunteer = volunteerRepository.findById(dto.getVolunteer().getId())
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            Association association = associationRepository.findById(dto.getAssociation().getId())
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            // ❗ Check if a request already exists
            boolean exists = volunteerRequestRepository.existsByVolunteerIdAndAssociationId(
                    dto.getVolunteer().getId(), dto.getAssociation().getId());
            if (exists) {
                return new Response(400, "Request already exists for this volunteer and association", null);
            }

            // Create the request
            VolunteerRequest volunteerRequest = new VolunteerRequest();
            volunteerRequest.setVolunteer(volunteer);
            volunteerRequest.setAssociation(association);
            volunteerRequest.setStatus(RequestStatus.PENDING);

            // Save the request
            VolunteerRequest savedRequest = volunteerRequestRepository.save(volunteerRequest);

            return new Response(201, "Request created successfully",
                    Utils.mapVolunteerRequestToDTOWithRelations(savedRequest));
        } catch (Exception e) {
            return new Response(500, "Failed to create request: " + e.getMessage(), null);
        }
    }



    /*@Override
    @PreAuthorize("hasRole('ADMIN')")
    public Response updateRequestStatus(UpdateRequestStatusDTO updateRequestStatusDTO) {
        try {
            // Get requestId and status from the DTO
            Long requestId = updateRequestStatusDTO.getRequestId();
            RequestStatus status = updateRequestStatusDTO.getStatus();

            // Retrieve the request by ID
            VolunteerRequest request = requestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            // Update the status of the request
            request.setStatus(status);

            // If approved, add the volunteer to the association and vice versa
            if (status == RequestStatus.APPROVED) {
                Volunteer volunteer = request.getVolunteer();
                Association association = request.getAssociation();
                association.getVolunteers().add(volunteer);
                volunteer.getAssociations().add(association);

                // Save the changes to both the association and volunteer
                associationRepository.save(association);
                volunteerRepository.save(volunteer);
            }

            // Save the updated request
            VolunteerRequest updatedRequest = requestRepository.save(request);

            // Return success response
            return new Response(200, "Request status updated", Utils.mapVolunteerRequestToDTOWithRelations(updatedRequest));
        } catch (Exception e) {
            return new Response(500, "Error updating request status: " + e.getMessage(), null);
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Response getAllRequests() {
        try {
            // Retrieve all requests
            List<VolunteerRequest> list = requestRepository.findAll();
            return new Response(200, "List of requests retrieved", Utils.mapVolunteerRequestListToDTOList(list));
        } catch (Exception e) {
            return new Response(500, "Error retrieving requests: " + e.getMessage(), null);
        }
    }*/

    @Override
    @PreAuthorize("hasRole('ASSOCIATION')")
    public Response getRequestsByAssociation(Long associationId) {
        try {
            // Ensure the association exists
            if (!associationRepository.existsById(associationId)) {
                throw new RuntimeException("Association does not exist");
            }

            // Retrieve requests for a specific association
            List<VolunteerRequest> list = requestRepository.findByAssociationId(associationId);
            return new Response(200, "Requests retrieved", Utils.mapVolunteerRequestListToDTOList(list));
        } catch (Exception e) {
            return new Response(500, "Error retrieving requests: " + e.getMessage(), null);
        }
    }
}
