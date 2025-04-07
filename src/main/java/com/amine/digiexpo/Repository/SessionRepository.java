package com.amine.digiexpo.Repository;

import com.amine.digiexpo.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByAssociationId(Long associationId); // Réservations d'une association
    List<Session> findByVolunteerId(Long volunteerId);     // Sessions à animer pour un bénévole
    List<Session> findByDate(LocalDate date);
    /*List<Session> findByConfirmedFalse();*/
}