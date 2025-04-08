package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;

import java.util.List;

public interface ISessionService {
    // Créer une session (utilisé par Association)
    Response createSession(SessionDTO sessionDTO);

    // Mettre à jour une session (ex: assigner un bénévole ou confirmer)
    Response updateSession(Long sessionId, SessionDTO sessionDTO);

    // Récupérer une session par ID
    Response getSessionById(Long sessionId);

    // Récupérer toutes les sessions
    Response getAllSessions();
}
