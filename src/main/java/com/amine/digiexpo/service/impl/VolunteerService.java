package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.AssociationDTO;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;
import com.amine.digiexpo.Repository.SessionRepository;
import com.amine.digiexpo.Repository.VolunteerRepository;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.service.interfac.IVolunteerService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

import static com.amine.digiexpo.utils.Utils.mapSessionListToDTOListWithAssociationDetails;
import static com.amine.digiexpo.utils.Utils.mapSessionToDTOWithAssociationDetails;

@Service
public class VolunteerService implements IVolunteerService {

    private final VolunteerRepository volunteerRepository;
    private final SessionRepository sessionRepository;

    @Autowired
    public VolunteerService(VolunteerRepository volunteerRepository,
                            SessionRepository sessionRepository) {
        this.volunteerRepository = volunteerRepository;
        this.sessionRepository = sessionRepository;
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
            existing.setAvailableDays(updatedVolunteerDTO.getAvailableDays());

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
