package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.Repository.AssociationRepository;
import com.amine.digiexpo.Repository.SessionRepository;
import com.amine.digiexpo.Repository.VolunteerRepository;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.enumeration.SessionStatus;
import com.amine.digiexpo.service.interfac.ISessionService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SessionService implements ISessionService {

    private final SessionRepository sessionRepository;
    private final AssociationRepository associationRepository;
    private final VolunteerRepository volunteerRepository;

    @Autowired
    public SessionService(SessionRepository sessionRepository,
                          AssociationRepository associationRepository,
                          VolunteerRepository volunteerRepository) {
        this.sessionRepository = sessionRepository;
        this.associationRepository = associationRepository;
        this.volunteerRepository = volunteerRepository;
    }

    @Override
    public Response createSession(List<SessionDTO> sessionDTOList) {
        try {
            List<Session> savedSessions = new ArrayList<>();

            for (SessionDTO dto : sessionDTOList) {
                Association association = associationRepository.findById(dto.getAssociation().getId())
                        .orElseThrow(() -> new RuntimeException("Association not found"));

                Session session = new Session();
                session.setDate(dto.getDate());
                session.setStatus(dto.getStatus() != null ? dto.getStatus() : SessionStatus.PENDING);
                session.setAssociation(association);

                savedSessions.add(sessionRepository.save(session));
            }

            return new Response(201, "Sessions created successfully",
                    Utils.mapSessionListToDTOList(savedSessions));

        } catch (Exception e) {
            return new Response(500, "Failed to create sessions: " + e.getMessage(), null);
        }
    }

    @Override
    public Response updateSession(Long sessionId, SessionDTO sessionDTO) {
        try {
            // 🔎 Validate sessionId
            if (sessionId == null) {
                return new Response(400, "Session ID is required", null);
            }

            // 🔎 Find the session or throw
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found with ID: " + sessionId));

            // 🔎 Validate required field: date
            if (sessionDTO.getDate() == null) {
                return new Response(400, "Session date is required", null);
            }

            // ✅ Update fields
            session.setDate(sessionDTO.getDate());

            if (sessionDTO.getStatus() != null) {
                session.setStatus(sessionDTO.getStatus());
            }

            // ✅ Update association if provided
            if (sessionDTO.getAssociation() != null && sessionDTO.getAssociation().getId() != null) {
                Association association = associationRepository.findById(sessionDTO.getAssociation().getId())
                        .orElseThrow(() -> new RuntimeException("Association not found with ID: " + sessionDTO.getAssociation().getId()));
                session.setAssociation(association);
            }

            // ✅ Update volunteer if provided
            if (sessionDTO.getVolunteer() != null && sessionDTO.getVolunteer().getId() != null) {
                Volunteer volunteer = volunteerRepository.findById(sessionDTO.getVolunteer().getId())
                        .orElseThrow(() -> new RuntimeException("Volunteer not found with ID: " + sessionDTO.getVolunteer().getId()));
                session.setVolunteer(volunteer);
            }

            // 💾 Save the updated session
            Session updatedSession = sessionRepository.save(session);

            return new Response(200, "Session updated successfully", Utils.mapSessionToDTOWithRelations(updatedSession));

        } catch (RuntimeException e) {
            return new Response(400, "Failed to update session: " + e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Unexpected error while updating session: " + e.getMessage(), null);
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

    // Method to assign a volunteer to a session
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
            if (!sessionAssociation.getVolunteers().contains(volunteer)) {
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
}