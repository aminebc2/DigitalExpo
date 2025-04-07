package com.amine.digiexpo.service.impl;

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
    public VolunteerDTO updateAvailableDays(Long volunteerId, List<DayOfWeek> availableDays) {
        // Récupérer le bénévole
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));

        // Mettre à jour les jours de disponibilité
        volunteer.setAvailableDays(availableDays);

        // Sauvegarder les modifications
        Volunteer updatedVolunteer = volunteerRepository.save(volunteer);

        // Mapper vers DTO avec relations
        return Utils.mapVolunteerEntityToVolunteerDTOWithRelations(updatedVolunteer);
    }

    @Override
    @PreAuthorize("hasRole('BENEVOLE')")
    public List<SessionDTO> getSessions(Long volunteerId) {
        // Vérifier si le bénévole existe
        if (!volunteerRepository.existsById(volunteerId)) {
            throw new RuntimeException("Volunteer not found");
        }

        // Récupérer les sessions assignées au bénévole
        List<Session> sessions = sessionRepository.findByVolunteerId(volunteerId);

        // Mapper la liste vers DTOs avec relations
        return Utils.mapSessionListEntityToSessionListDTO(sessions);
    }

    @Override
    @PreAuthorize("hasRole('BENEVOLE')")
    public VolunteerDTO getVolunteerById(Long volunteerId) {
        // Récupérer le bénévole
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));

        // Mapper vers DTO avec relations
        return Utils.mapVolunteerEntityToVolunteerDTOWithRelations(volunteer);
    }
}