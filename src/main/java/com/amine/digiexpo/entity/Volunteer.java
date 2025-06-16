package com.amine.digiexpo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("VOLUNTEER")
@Data
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Volunteer extends User {

    private String phoneNumber;

    private String fullName;

    @ElementCollection
    private List<DayOfWeek> availableDays;

    @ManyToMany(mappedBy = "volunteers", fetch = FetchType.LAZY)
    private Set<Association> associations;


    @OneToMany(mappedBy = "volunteer")
    private List<Session> sessions;

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

    public Set<Association> getAssociations() {
        return associations;
    }

    public void setAssociations(Set<Association> associations) {
        this.associations = associations;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }
}