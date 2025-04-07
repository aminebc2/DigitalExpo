package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.AssociationDTO;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;
import com.amine.digiexpo.Repository.AssociationRepository;
import com.amine.digiexpo.Repository.SessionRepository;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.enumeration.SessionStatus;
import com.amine.digiexpo.service.interfac.IAssociationService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AssociationService implements IAssociationService {

    private final AssociationRepository associationRepository;
    private final SessionRepository sessionRepository;

    @Autowired
    public AssociationService(AssociationRepository associationRepository,
                                  SessionRepository sessionRepository) {
        this.associationRepository = associationRepository;
        this.sessionRepository = sessionRepository;
    }

    @Override
    @PreAuthorize("hasRole('ASSOCIATION')")
    public SessionDTO reserveSession(Long associationId, LocalDate date) {
        // Récupérer l'association
        Association association = associationRepository.findById(associationId)
                .orElseThrow(() -> new RuntimeException("Association not found"));

        // Créer une nouvelle session
        Session session = new Session();
        session.setDate(date);
        session.setStatus(SessionStatus.PENDING); // Statut par défaut
        session.setAssociation(association);

        // Sauvegarder la session
        Session savedSession = sessionRepository.save(session);

        // Mapper vers DTO avec relations
        return Utils.mapSessionEntityToSessionDTOWithRelations(savedSession);
    }

    @Override
    @PreAuthorize("hasRole('ASSOCIATION')")
    public List<SessionDTO> getSessions(Long associationId) {
        // Vérifier si l'association existe
        if (!associationRepository.existsById(associationId)) {
            throw new RuntimeException("Association not found");
        }

        // Récupérer les sessions de l'association
        List<Session> sessions = sessionRepository.findByAssociationId(associationId);

        // Mapper la liste vers DTOs avec relations
        return Utils.mapSessionListEntityToSessionListDTO(sessions);
    }

    @Override
    @PreAuthorize("hasRole('ASSOCIATION')")
    public List<VolunteerDTO> getVolunteers(Long associationId) {
        // Récupérer l'association avec ses bénévoles
        Association association = associationRepository.findById(associationId)
                .orElseThrow(() -> new RuntimeException("Association not found"));

        // Mapper les bénévoles vers DTOs
        return Utils.mapVolunteerListEntityToVolunteerListDTO(association.getVolunteers());
    }

    @Override
    @PreAuthorize("hasRole('ASSOCIATION')")
    public AssociationDTO getAssociationById(Long associationId) {
        // Récupérer l'association
        Association association = associationRepository.findById(associationId)
                .orElseThrow(() -> new RuntimeException("Association not found"));

        // Mapper vers DTO avec relations
        return Utils.mapAssociationEntityToAssociationDTOWithRelations(association);
    }
}