package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;

import java.time.DayOfWeek;
import java.util.List;

public interface IVolunteerService {
    // Indiquer les jours de disponibilité
    VolunteerDTO updateAvailableDays(Long volunteerId, List<DayOfWeek> availableDays);

    // Consulter la liste des sessions à animer
    List<SessionDTO> getSessions(Long volunteerId);

    // Récupérer les détails du bénévole
    VolunteerDTO getVolunteerById(Long volunteerId);
}
