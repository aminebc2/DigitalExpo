package com.amine.digiexpo.Repository;

import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.enumeration.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByAssociationId(Long associationId); // Réservations d'une association
    List<Session> findByVolunteerId(Long volunteerId);
    List<Session> findByAssociationIdAndVolunteerId(Long associationId, Long volunteerId);
    List<Session> findByStatusAndVolunteerIsNullAndAssociationIn(SessionStatus status, List<Association> associations);
    List<Session> findByStatusAndVolunteerIsNull(SessionStatus status);
    boolean existsByDate(LocalDate date);
    Session findByDate(LocalDate date);
}