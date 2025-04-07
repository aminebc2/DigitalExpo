package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.SessionDTO;

import java.util.List;

public interface ISessionService {
    // Créer une session (utilisé par Association)
    SessionDTO createSession(SessionDTO sessionDTO);

    // Mettre à jour une session (ex: assigner un bénévole ou confirmer)
    SessionDTO updateSession(Long sessionId, SessionDTO sessionDTO);

    // Récupérer une session par ID
    SessionDTO getSessionById(Long sessionId);

    // Récupérer toutes les sessions
    List<SessionDTO> getAllSessions();
}
