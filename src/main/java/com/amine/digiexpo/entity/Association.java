package com.amine.digiexpo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("ASSOCIATION")
@Data
public class Association extends User {

    private String name;

    private String ville;

    private String responsableName;

    private String responsablePhone;

    @OneToMany(mappedBy = "association", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Session> sessions;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
            name = "association_volunteer",
            joinColumns = @JoinColumn(name = "association_id"),
            inverseJoinColumns = @JoinColumn(name = "volunteer_id")
    )
    private List<Volunteer> volunteers;

}