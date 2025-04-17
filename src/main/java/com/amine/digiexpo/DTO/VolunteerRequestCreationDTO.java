package com.amine.digiexpo.DTO;

import lombok.Data;

@Data
public class VolunteerRequestCreationDTO {
    private Long volunteerId;
    private Long associationId;

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public Long getAssociationId() {
        return associationId;
    }

    public void setAssociationId(Long associationId) {
        this.associationId = associationId;
    }
}
