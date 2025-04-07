package com.amine.digiexpo.entity;

import com.amine.digiexpo.enumeration.RequestStatus;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class VolunteerRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;

    @ManyToOne
    @JoinColumn(name = "association_id")
    private Association association;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;
}