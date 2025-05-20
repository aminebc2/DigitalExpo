package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.AssociationDTO;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;
import com.amine.digiexpo.Repository.AssociationRepository;
import com.amine.digiexpo.Repository.SessionRepository;
import com.amine.digiexpo.Repository.VolunteerRepository;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.enumeration.SessionStatus;
import com.amine.digiexpo.service.interfac.IAssociationService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AssociationService implements IAssociationService {

    @Autowired
    private AssociationRepository associationRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Override
    public Response reserveSession(Long associationId, List<LocalDate> dates) {
        try {
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            List<Session> savedSessions = new ArrayList<>();

            for (LocalDate date : dates) {
                Session session = new Session();
                session.setDate(date);
                session.setStatus(SessionStatus.PENDING);
                session.setAssociation(association);
                Session saved = sessionRepository.save(session);
                savedSessions.add(saved);
            }

            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Sessions reserved successfully");
            response.setSessionList(Utils.mapSessionListToDTOList(savedSessions));
            return response;
        } catch (Exception e) {
            return new Response(500, "Failed to reserve sessions: " + e.getMessage(), null);
        }
    }

    @Override
    public Response updateAssociation(Long associationId, AssociationDTO updatedAssociationDTO) {
        try {
            Association existing = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            existing.setUsername(updatedAssociationDTO.getUsername());
            existing.setEmail(updatedAssociationDTO.getEmail());
            existing.setName(updatedAssociationDTO.getName());
            existing.setVille(updatedAssociationDTO.getVille());
            existing.setResponsableName(updatedAssociationDTO.getResponsableName());
            existing.setResponsablePhone(updatedAssociationDTO.getResponsablePhone());

            Association saved = associationRepository.save(existing);

            return new Response(200, "Association updated successfully", Utils.mapAssociationToDTO(saved));
        } catch (Exception e) {
            return new Response(500, "Failed to update association: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getSessions(Long associationId) {
        try {
            if (!associationRepository.existsById(associationId)) {
                return new Response(404, "Association not found", null);
            }

            List<Session> sessions = sessionRepository.findByAssociationId(associationId);

            // Use the new utility function to map sessions with volunteer details
            List<SessionDTO> sessionDTOList = Utils.mapSessionListToDTOListWithVolunteerDetails(sessions);

            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Session list retrieved");
            response.setSessionList(sessionDTOList);

            return response;
        } catch (Exception e) {
            return new Response(500, "Failed to retrieve sessions: " + e.getMessage(), null);
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
    public Response getAssociationById(Long associationId) {
        try {
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Association found");
            response.setAssociation(Utils.mapAssociationToDTO(association));
            return response;
        } catch (Exception e) {
            return new Response(500, "Failed to retrieve association: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getAllAssociations() {
        List<Association> associations = associationRepository.findAll();
        List<AssociationDTO> dtos = Utils.mapAssociationListToDTOList(associations);

        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("Associations fetched successfully");
        response.setAssociationList(dtos);
        return response;
    }

}