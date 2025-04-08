package com.amine.digiexpo.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
public class VolunteerDTO extends UserDTO {
    private String phoneNumber;
    private List<DayOfWeek> availableDays;
    private List<AssociationDTO> associations;
    private List<SessionDTO> sessions;

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public List<DayOfWeek> getAvailableDays() {
        return availableDays;
    }

    public void setAvailableDays(List<DayOfWeek> availableDays) {
        this.availableDays = availableDays;
    }

    public List<AssociationDTO> getAssociations() {
        return associations;
    }

    public void setAssociations(List<AssociationDTO> associations) {
        this.associations = associations;
    }

    public List<SessionDTO> getSessions() {
        return sessions;
    }

    public void setSessions(List<SessionDTO> sessions) {
        this.sessions = sessions;
    }
}