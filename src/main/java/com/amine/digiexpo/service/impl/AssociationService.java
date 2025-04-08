package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.Repository.AssociationRepository;
import com.amine.digiexpo.Repository.SessionRepository;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.enumeration.SessionStatus;
import com.amine.digiexpo.service.interfac.IAssociationService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AssociationService implements IAssociationService {

    @Autowired
    private AssociationRepository associationRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Override
    public Response reserveSession(Long associationId, LocalDate date) {
        try {
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            Session session = new Session();
            session.setDate(date);
            session.setStatus(SessionStatus.PENDING);
            session.setAssociation(association);

            Session savedSession = sessionRepository.save(session);

            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Session reserved successfully");
            response.setSession(Utils.mapSessionToDTO(savedSession));
            return response;
        } catch (Exception e) {
            return new Response(500, "Failed to reserve session: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getSessions(Long associationId) {
        try {
            if (!associationRepository.existsById(associationId)) {
                return new Response(404, "Association not found", null);
            }

            List<Session> sessions = sessionRepository.findByAssociationId(associationId);
            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Session list retrieved");
            response.setSessionList(Utils.mapSessionListToDTOList(sessions));
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
}
