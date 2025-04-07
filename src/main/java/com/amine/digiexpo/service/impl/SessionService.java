package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.Repository.AssociationRepository;
import com.amine.digiexpo.Repository.SessionRepository;
import com.amine.digiexpo.Repository.VolunteerRepository;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.service.interfac.ISessionService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

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
    @PreAuthorize("hasRole('ASSOCIATION')")
    public SessionDTO createSession(SessionDTO sessionDTO) {
        Association association = associationRepository.findById(sessionDTO.getAssociation().getId())
                .orElseThrow(() -> new RuntimeException("Association not found"));

        Session session = new Session();
        session.setDate(sessionDTO.getDate());
        session.setStatus(sessionDTO.getStatus());
        session.setAssociation(association);

        Session savedSession = sessionRepository.save(session);
        return Utils.mapSessionEntityToSessionDTOWithRelations(savedSession);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public SessionDTO updateSession(Long sessionId, SessionDTO sessionDTO) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

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

        Session updatedSession = sessionRepository.save(session);
        return Utils.mapSessionEntityToSessionDTOWithRelations(updatedSession);
    }

    @Override
    @PreAuthorize("hasAnyRole('ASSOCIATION', 'BENEVOLE', 'ADMIN')")
    public SessionDTO getSessionById(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        return Utils.mapSessionEntityToSessionDTOWithRelations(session);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<SessionDTO> getAllSessions() {
        List<Session> sessions = sessionRepository.findAll();
        return Utils.mapSessionListEntityToSessionListDTO(sessions);
    }
}