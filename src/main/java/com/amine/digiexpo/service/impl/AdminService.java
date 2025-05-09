package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.*;
import com.amine.digiexpo.Repository.*;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.entity.VolunteerRequest;
import com.amine.digiexpo.enumeration.RequestStatus;
import com.amine.digiexpo.enumeration.SessionStatus;
import com.amine.digiexpo.service.interfac.IAdminService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class AdminService implements IAdminService {

    @Autowired
    private AssociationRepository associationRepository;
    @Autowired
    private VolunteerRepository volunteerRepository;
    @Autowired
    private VolunteerRequestRepository volunteerRequestRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Response createAssociation(AssociationDTO associationDTO) {
        try {
            if (associationRepository.findByUsername(associationDTO.getUsername()).isPresent() ||
                    associationRepository.findByEmail(associationDTO.getEmail()).isPresent()) {
                return new Response(400, "Username or email already exists", null);
            }

            Association association = new Association();
            association.setUsername(associationDTO.getUsername());
            association.setEmail(associationDTO.getEmail());
            association.setPassword(passwordEncoder.encode(associationDTO.getPassword()));
            association.setRole(associationDTO.getRole());
            association.setName(associationDTO.getName());
            association.setVille(associationDTO.getVille());
            association.setResponsableName(associationDTO.getResponsableName());
            association.setResponsablePhone(associationDTO.getResponsablePhone());

            Association savedAssociation = associationRepository.save(association);
            AssociationDTO savedAssociationDTO = Utils.mapAssociationToDTOWithRelations(savedAssociation);

            return new Response(201, "Association created successfully", savedAssociationDTO);
        } catch (Exception e) {
            // Logging error for debugging and improving error response.
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "Error creating association", e);
            return new Response(500, "Internal server error: " + e.getMessage(), null);
        }
    }



    @Override
    public Response updateAssociation(Long associationId, AssociationDTO associationDTO) {
        try {
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            if (associationDTO.getUsername() != null) association.setUsername(associationDTO.getUsername());
            if (associationDTO.getEmail() != null) association.setEmail(associationDTO.getEmail());
            if (associationDTO.getName() != null) association.setName(associationDTO.getName());
            if (associationDTO.getVille() != null) association.setVille(associationDTO.getVille());
            if (associationDTO.getResponsableName() != null)
                association.setResponsableName(associationDTO.getResponsableName());
            if (associationDTO.getResponsablePhone() != null)
                association.setResponsablePhone(associationDTO.getResponsablePhone());

            Association updatedAssociation = associationRepository.save(association);
            AssociationDTO updatedAssociationDTO = Utils.mapAssociationToDTOWithRelations(updatedAssociation);

            return new Response(200, "Association updated successfully", updatedAssociationDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Response deleteAssociation(Long associationId) {
        try {
            if (!associationRepository.existsById(associationId)) {
                throw new RuntimeException("Association not found");
            }
            associationRepository.deleteById(associationId);
            return new Response(200, "Association deleted successfully", null);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Response getAllAssociations() {
        List<Association> associations = associationRepository.findAll();
        List<AssociationDTO> associationDTOs = associations.stream()
                .map(Utils::mapAssociationToDTOWithRelations)
                .toList();

        return new Response(200, "Associations retrieved successfully", associationDTOs);
    }

    public Response createVolunteer(VolunteerDTO volunteerDTO) {
        try {
            if (volunteerRepository.findByUsername(volunteerDTO.getUsername()).isPresent() ||
                    volunteerRepository.findByEmail(volunteerDTO.getEmail()).isPresent()) {
                return new Response(400, "Username or email already exists", null);
            }

            Volunteer volunteer = new Volunteer();
            volunteer.setUsername(volunteerDTO.getUsername());
            volunteer.setEmail(volunteerDTO.getEmail());
            volunteer.setPassword(passwordEncoder.encode(volunteerDTO.getPassword()));
            volunteer.setRole(volunteerDTO.getRole());
            volunteer.setPhoneNumber(volunteerDTO.getPhoneNumber());
            volunteer.setAvailableDays(volunteerDTO.getAvailableDays());

            Volunteer savedVolunteer = volunteerRepository.save(volunteer);
            VolunteerDTO savedVolunteerDTO = Utils.mapVolunteerToDTOWithRelations(savedVolunteer);

            return new Response(201, "Volunteer created successfully", savedVolunteerDTO);
        } catch (Exception e) {
            // Logging error for debugging and improving error response.
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "Error creating volunteer", e);
            return new Response(500, "Internal server error: " + e.getMessage(), null);
        }
    }


    @Override
    public Response updateVolunteer(Long volunteerId, VolunteerDTO volunteerDTO) {
        try {
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            if (volunteerDTO.getUsername() != null) volunteer.setUsername(volunteerDTO.getUsername());
            if (volunteerDTO.getEmail() != null) volunteer.setEmail(volunteerDTO.getEmail());
            if (volunteerDTO.getPhoneNumber() != null) volunteer.setPhoneNumber(volunteerDTO.getPhoneNumber());
            if (volunteerDTO.getAvailableDays() != null) volunteer.setAvailableDays(volunteerDTO.getAvailableDays());

            Volunteer updatedVolunteer = volunteerRepository.save(volunteer);
            VolunteerDTO updatedVolunteerDTO = Utils.mapVolunteerToDTO(updatedVolunteer);

            return new Response(200, "Volunteer updated successfully", updatedVolunteerDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Response deleteVolunteer(Long volunteerId) {
        try {
            if (!volunteerRepository.existsById(volunteerId)) {
                throw new RuntimeException("Volunteer not found");
            }
            volunteerRepository.deleteById(volunteerId);
            return new Response(200, "Volunteer deleted successfully", null);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Response getAllVolunteers() {
        List<Volunteer> volunteers = volunteerRepository.findAll();

        // Validate if data exists in the database
        if (volunteers.isEmpty()) {
            return new Response(200, "No volunteers found", null);
        }

        List<VolunteerDTO> volunteerDTOs = volunteers.stream()
                .map(Utils::mapVolunteerToDTO)
                .collect(Collectors.toList());

        // Ensure data is wrapped in the "data" field
        return new Response(200, "Volunteers retrieved successfully", volunteerDTOs);
    }


    /*@Override
    public Response validateVolunteerRequest(Long requestId) {
        try {
            VolunteerRequest volunteerRequest = volunteerRequestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Volunteer request not found"));

            volunteerRequest.setStatus(RequestStatus.APPROVED);
            Volunteer volunteer = volunteerRequest.getVolunteer();
            Association association = volunteerRequest.getAssociation();
            association.getVolunteers().add(volunteer);
            volunteer.getAssociations().add(association);

            volunteerRequestRepository.save(volunteerRequest);
            associationRepository.save(association);
            volunteerRepository.save(volunteer);

            return new Response(200, "Volunteer request approved successfully", volunteerRequest);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }*/

    @Override
    public Response updateRequestStatus(UpdateRequestStatusDTO updateRequestStatusDTO) {
        try {
            Long requestId = updateRequestStatusDTO.getRequestId();
            RequestStatus status = updateRequestStatusDTO.getStatus();

            // Retrieve the request by ID
            VolunteerRequest request = volunteerRequestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            request.setStatus(status);

            // Handle logic when the request is approved
            if (status == RequestStatus.APPROVED) {
                Volunteer volunteer = request.getVolunteer();
                Association association = request.getAssociation();
                if (!association.getVolunteers().contains(volunteer)) {
                    association.getVolunteers().add(volunteer);
                    volunteer.getAssociations().add(association);
                    associationRepository.save(association);
                    volunteerRepository.save(volunteer);
                }
            }

            // Save the updated request
            VolunteerRequest updatedRequest = volunteerRequestRepository.save(request);

            return new Response(200, "Request status updated", Utils.mapVolunteerRequestToDTOWithRelations(updatedRequest));
        } catch (Exception e) {
            return new Response(500, "Error updating request status: " + e.getMessage(), null);
        }
    }


    @Override
    public Response getAllRequests() {
        try {
            // Retrieve all requests
            List<VolunteerRequest> list = volunteerRequestRepository.findAll();
            return new Response(200, "List of requests retrieved", Utils.mapVolunteerRequestListToDTOList(list));
        } catch (Exception e) {
            return new Response(500, "Error retrieving requests: " + e.getMessage(), null);
        }
    }

    @Override
    public Response confirmSession(Long sessionId, SessionStatus status) {
        try {
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            session.setStatus(status);
            Session updatedSession = sessionRepository.save(session);
            SessionDTO sessionDTO = Utils.mapSessionToDTO(updatedSession);

            return new Response(200, "Session " + status.name().toLowerCase() + " successfully", sessionDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Response updateSession(Long sessionId, SessionStatusUpdateDTO sessionStatusUpdateDTO) {
        try {
            if (sessionId == null) {
                return new Response(400, "Session ID is required", null);
            }

            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found with ID: " + sessionId));

            // ✅ Only update status (we're only passing status in the DTO)
            if (sessionStatusUpdateDTO.getStatus() != null) {
                session.setStatus(sessionStatusUpdateDTO.getStatus());
            } else {
                return new Response(400, "Status is required", null);
            }

            Session updatedSession = sessionRepository.save(session);
            return new Response(200, "Session updated successfully", Utils.mapSessionToDTOWithRelations(updatedSession));

        } catch (RuntimeException e) {
            return new Response(400, "Failed to update session: " + e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Unexpected error while updating session: " + e.getMessage(), null);
        }
    }


    @Override
    public Response getAllSessions() {
        try {
            // Retrieve all sessions
            List<Session> sessions = sessionRepository.findAll();

            // Return successful response
            return new Response(200, "Sessions retrieved successfully", Utils.mapSessionListToDTOList(sessions));
        } catch (Exception e) {
            // Handle exceptions and return error response
            return new Response(500, "Failed to retrieve sessions: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getSessionById(Long sessionId) {
        try {
            // Find the session by ID
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            // Return successful response
            return new Response(200, "Session retrieved successfully", Utils.mapSessionToDTOWithRelations(session));
        } catch (Exception e) {
            // Handle exceptions and return error response
            return new Response(500, "Failed to retrieve session: " + e.getMessage(), null);
        }
    }

    @Override
    public Response assignVolunteerToSession(Long sessionId, Long volunteerId) {
        try {
            // Fetch the session by ID
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            // Fetch the volunteer by ID
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            // Check if the session belongs to an association
            Association sessionAssociation = session.getAssociation();
            if (sessionAssociation == null) {
                return new Response(400, "Session does not belong to any association", null);
            }

            // Ensure the volunteer is part of the association
            boolean isVolunteerInAssociation = volunteer.getAssociations().contains(sessionAssociation);
            if (!isVolunteerInAssociation) {
                return new Response(400, "This volunteer is not part of the association for this session", null);
            }

            // Assign the volunteer to the session
            session.setVolunteer(volunteer);

            // Save the updated session
            sessionRepository.save(session);

            return new Response(200, "Volunteer successfully assigned to the session", null);

        } catch (RuntimeException e) {
            return new Response(400, "Failed to assign volunteer: " + e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Unexpected error while updating session: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getVolunteers(Long associationId) {
        try {
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Volunteer list retrieved");
            response.setVolunteerList(Utils.mapVolunteerListToDTOList(association.getVolunteers()));
            return response;
        } catch (Exception e) {
            return new Response(500, "Failed to retrieve volunteers: " + e.getMessage(), null);
        }
    }

}