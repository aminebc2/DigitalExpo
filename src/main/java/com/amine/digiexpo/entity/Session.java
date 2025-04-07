package com.amine.digiexpo.entity;

import com.amine.digiexpo.enumeration.SessionStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private SessionStatus status = SessionStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "association_id")
    private Association association;

    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;
}