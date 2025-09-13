package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.VolunteerDTO;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

public interface IVolunteerService {
    // Indiquer les jours de disponibilité
    Response updateAvailableDays(Long volunteerId, List<DayOfWeek> availableDays);

    Response getPendingSessions(Long volunteerId);

    Response chooseSessionToAnimate(Long sessionId, Long volunteerId);

    Response getAvailableSessionsToAnimate(Long volunteerId);

    // Consulter la liste des sessions à animer
    Response getSessions(Long volunteerId);

    // Récupérer les détails du bénévole
    Response getVolunteerById(Long volunteerId);

    Response updateVolunteer(Long volunteerId, VolunteerDTO updatedVolunteerDTO);

    Response getSessionById(Long sessionId);

    /*Response assignSessionToVolunteerByDate(Long volunteerId, Long sessionId, LocalDate date);*/
}
