package com.amine.digiexpo.DTO;

import com.amine.digiexpo.enumeration.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {
    private Long id;
    private LocalDate date;
    private SessionStatus status;
    private AssociationDTO  association;
    private VolunteerDTO  volunteer;

    public VolunteerDTO getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(VolunteerDTO volunteer) {
        this.volunteer = volunteer;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public AssociationDTO getAssociation() {
        return association;
    }

    public void setAssociation(AssociationDTO association) {
        this.association = association;
    }
}