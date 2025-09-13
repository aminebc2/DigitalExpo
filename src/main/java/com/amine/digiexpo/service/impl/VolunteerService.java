package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;
import com.amine.digiexpo.Repository.SessionRepository;
import com.amine.digiexpo.Repository.VolunteerRepository;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.enumeration.SessionStatus;
import com.amine.digiexpo.service.interfac.IVolunteerService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class VolunteerService implements IVolunteerService {

    @Autowired
    private final VolunteerRepository volunteerRepository;
    @Autowired
    private final SessionRepository sessionRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public VolunteerService(VolunteerRepository volunteerRepository,
                            SessionRepository sessionRepository, PasswordEncoder passwordEncoder) {
        this.volunteerRepository = volunteerRepository;
        this.sessionRepository = sessionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @PreAuthorize("hasRole('BENEVOLE')")
    public Response updateAvailableDays(Long volunteerId, List<DayOfWeek> availableDays) {
        try {
            // Récupérer le bénévole
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            // Mettre à jour les jours de disponibilité
            volunteer.setAvailableDays(availableDays);

            // Sauvegarder les modifications
            Volunteer updatedVolunteer = volunteerRepository.save(volunteer);

            // Mapper vers DTO avec relations
            return new Response(200, "Volunteer availability updated successfully", Utils.mapVolunteerToDTOWithRelations(updatedVolunteer));
        } catch (Exception e) {
            // Handle errors and return failure response
            return new Response(500, "Failed to update volunteer availability: " + e.getMessage(), null);
        }
    }

    @Override
    @PreAuthorize("hasRole('BENEVOLE')")
    public Response getPendingSessions(Long volunteerId) {
        try {
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));
            List<Association> associations = new ArrayList<>(volunteer.getAssociations());
            List<Session> sessions = sessionRepository.findByStatusAndVolunteerIsNullAndAssociationIn(
                    SessionStatus.PENDING, associations
            );
            List<SessionDTO> sessionDTOs = sessions.stream()
                    .map(Utils::mapSessionToDTOWithRelations)
                    .toList();
            return new Response(200, "Pending sessions", sessionDTOs);
        } catch (Exception e) {
            return new Response(500, "Failed to retrieve pending sessions: " + e.getMessage(), null);
        }
    }

    private List<SessionDTO> mapSessionListToDTOListWithAssociationDetails(List<Session> sessions) {
        return sessions.stream()
                .map(Utils::mapSessionToDTOWithRelations)
                .toList();
    }

    public Response chooseSessionToAnimate(Long sessionId, Long volunteerId) {
        try {
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            if (session.getVolunteer() != null) {
                return new Response(400, "Session already has a volunteer", null);
            }

            Association association = session.getAssociation();
            if (association == null || !volunteer.getAssociations().contains(association)) {
                return new Response(400, "You are not part of this association", null);
            }

            // Assign volunteer and set status to CONFIRMED
            session.setVolunteer(volunteer);
            session.setStatus(SessionStatus.CONFIRMED);
            sessionRepository.save(session);

            return new Response(200, "You have been assigned to animate the session", Utils.mapSessionToDTOWithRelations(session));
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Unexpected error: " + e.getMessage(), null);
        }
    }

    @Override
    @PreAuthorize("hasRole('BENEVOLE')")
    public Response getAvailableSessionsToAnimate(Long volunteerId) {
        try {
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            // Get all associations the volunteer is part of
            Set<Association> associationSet = volunteer.getAssociations();
            List<Association> associationList = new ArrayList<>(associationSet);
            List<Session> availableSessions = sessionRepository.findByStatusAndVolunteerIsNullAndAssociationIn(
                    SessionStatus.PENDING, associationList);

            List<SessionDTO> sessionDTOs = availableSessions.stream()
                    .map(Utils::mapSessionToDTOWithRelations)
                    .toList();

            return new Response(200, "Available sessions retrieved", sessionDTOs);
        } catch (Exception e) {
            return new Response(500, "Failed to retrieve available sessions: " + e.getMessage(), null);
        }
    }

    @Override
    @PreAuthorize("hasRole('BENEVOLE')")
    public Response getSessions(Long volunteerId) {
        try {
            // Check if the volunteer exists
            if (!volunteerRepository.existsById(volunteerId)) {
                throw new RuntimeException("Volunteer not found");
            }

            // Retrieve the sessions assigned to the volunteer
            List<Session> sessions = sessionRepository.findByVolunteerId(volunteerId);

            // Map the list of sessions to DTOs with association details
            List<SessionDTO> sessionDTOs = mapSessionListToDTOListWithAssociationDetails(sessions);

            // Return the response with the session data
            return new Response(200, "Sessions retrieved successfully", sessionDTOs);
        } catch (Exception e) {
            // Handle errors and return a failure response
            return new Response(500, "Failed to retrieve sessions: " + e.getMessage(), null);
        }
    }

    @Override
    @PreAuthorize("hasRole('BENEVOLE')")
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
    @PreAuthorize("hasRole('BENEVOLE')")
    public Response updateVolunteer(Long volunteerId, VolunteerDTO updatedVolunteerDTO) {
        try {
            Volunteer existing = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            existing.setUsername(updatedVolunteerDTO.getUsername());
            existing.setEmail(updatedVolunteerDTO.getEmail());
            existing.setPhoneNumber(updatedVolunteerDTO.getPhoneNumber());
            existing.setFullName(updatedVolunteerDTO.getFullName());
            existing.setAvailableDays(updatedVolunteerDTO.getAvailableDays());

            // Update password if provided
            if (updatedVolunteerDTO.getPassword() != null && !updatedVolunteerDTO.getPassword().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(updatedVolunteerDTO.getPassword()));
            }

            Volunteer saved = volunteerRepository.save(existing);

            return new Response(200, "Association updated successfully", Utils.mapVolunteerToDTO(saved));
        } catch (Exception e) {
            return new Response(500, "Failed to update association: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getVolunteerById(Long volunteerId) {
        try {
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Volunteer found");
            response.setVolunteer(Utils.mapVolunteerToDTO(volunteer));
            return response;
        } catch (Exception e) {
            return new Response(500, "Failed to retrieve association: " + e.getMessage(), null);
        }
    }
}
