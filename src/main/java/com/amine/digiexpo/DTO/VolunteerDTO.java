package com.amine.digiexpo.DTO;

import lombok.Data;

import java.time.DayOfWeek;
import java.util.List;

@Data
public class VolunteerDTO extends UserDTO {
    private String phoneNumber;
    private List<DayOfWeek> availableDays;
    private List<AssociationDTO> associations;
    private List<SessionDTO> sessions;
}