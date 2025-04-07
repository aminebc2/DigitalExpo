package com.amine.digiexpo.DTO;

import com.amine.digiexpo.enumeration.RequestStatus;
import lombok.Data;


@Data
public class VolunteerRequestDTO {
    private Long id;
    private VolunteerDTO volunteer;
    private AssociationDTO association;
    private RequestStatus status;
}