package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;

import java.time.DayOfWeek;
import java.util.List;

public interface IVolunteerService {
    // Indiquer les jours de disponibilité
    Response updateAvailableDays(Long volunteerId, List<DayOfWeek> availableDays);

    // Consulter la liste des sessions à animer
    Response getSessions(Long volunteerId);

    // Récupérer les détails du bénévole
    Response getVolunteerById(Long volunteerId);
}
