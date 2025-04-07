package com.amine.digiexpo.DTO;

import lombok.Data;

import java.util.List;

@Data
public class AssociationDTO extends UserDTO {
    private String name;
    private String ville;
    private String responsableName;
    private String responsablePhone;
    private List<SessionDTO> sessions;
    private List<VolunteerDTO> volunteers;
}