package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;
import com.amine.digiexpo.Repository.SessionRepository;
import com.amine.digiexpo.Repository.VolunteerRepository;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.service.interfac.IVolunteerService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;

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
            // Vérifier si le bénévole existe
            if (!volunteerRepository.existsById(volunteerId)) {
                throw new RuntimeException("Volunteer not found");
            }

            // Récupérer les sessions assignées au bénévole
            List<Session> sessions = sessionRepository.findByVolunteerId(volunteerId);

            // Mapper la liste vers DTOs avec relations
            return new Response(200, "Sessions retrieved successfully", Utils.mapSessionListToDTOList(sessions));
        } catch (Exception e) {
            // Handle errors and return failure response
            return new Response(500, "Failed to retrieve sessions: " + e.getMessage(), null);
        }
    }

    @Override
    @PreAuthorize("hasRole('BENEVOLE')")
    public Response getVolunteerById(Long volunteerId) {
        try {
            // Récupérer le bénévole
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            // Mapper vers DTO avec relations
            return new Response(200, "Volunteer retrieved successfully", Utils.mapVolunteerToDTOWithRelations(volunteer));
        } catch (Exception e) {
            // Handle errors and return failure response
            return new Response(500, "Failed to retrieve volunteer: " + e.getMessage(), null);
        }
    }
}
