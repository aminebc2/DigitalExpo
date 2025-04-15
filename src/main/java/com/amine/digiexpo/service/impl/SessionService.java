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
import org.springframework.security.access.prepost.PreAuthorize;
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
            // Find the session
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            // Update session fields if provided in the DTO
            if (sessionDTO.getDate() != null) {
                session.setDate(sessionDTO.getDate());
            }
            if (sessionDTO.getStatus() != null) {
                session.setStatus(sessionDTO.getStatus());
            }
            if (sessionDTO.getAssociation() != null && sessionDTO.getAssociation().getId() != null) {
                Association association = associationRepository.findById(sessionDTO.getAssociation().getId())
                        .orElseThrow(() -> new RuntimeException("Association not found"));
                session.setAssociation(association);
            }
            if (sessionDTO.getVolunteer() != null && sessionDTO.getVolunteer().getId() != null) {
                Volunteer volunteer = volunteerRepository.findById(sessionDTO.getVolunteer().getId())
                        .orElseThrow(() -> new RuntimeException("Volunteer not found"));
                session.setVolunteer(volunteer);
            }

            // Save the updated session
            Session updatedSession = sessionRepository.save(session);

            // Return successful response
            return new Response(200, "Session updated successfully", Utils.mapSessionToDTOWithRelations(updatedSession));
        } catch (Exception e) {
            // Handle exceptions and return error response
            return new Response(500, "Failed to update session: " + e.getMessage(), null);
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
}
