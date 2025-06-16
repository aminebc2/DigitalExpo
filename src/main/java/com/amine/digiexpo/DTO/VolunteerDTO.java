package com.amine.digiexpo.DTO;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.util.List;

@AllArgsConstructor
public class VolunteerDTO extends UserDTO {
    private String phoneNumber;
    private String fullName;
    private List<DayOfWeek> availableDays;
    private List<AssociationDTO> associations;
    private List<SessionDTO> sessions;

    public VolunteerDTO() {

    }

    public VolunteerDTO(String username, String email, String phoneNumber, String fullName) {
        this.setUsername(username);
        this.setEmail(email);
        this.setPhoneNumber(phoneNumber);
        this.setFullName(fullName);
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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