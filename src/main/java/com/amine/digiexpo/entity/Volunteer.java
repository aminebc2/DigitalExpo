package com.amine.digiexpo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.DayOfWeek;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("VOLUNTEER")
@Data
public class Volunteer extends User {

    private String phoneNumber;

    @ElementCollection
    private List<DayOfWeek> availableDays;

    @ManyToMany(mappedBy = "volunteers")
    private List<Association> associations;

    @OneToMany(mappedBy = "volunteer")
    private List<Session> sessions;

}