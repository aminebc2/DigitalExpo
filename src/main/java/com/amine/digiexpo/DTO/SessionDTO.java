package com.amine.digiexpo.DTO;

import com.amine.digiexpo.enumeration.SessionStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SessionDTO {
    private Long id;
    private LocalDate date;
    private SessionStatus status;
    private AssociationDTO  association;
    private VolunteerDTO  volunteer;
}