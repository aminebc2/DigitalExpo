package com.amine.digiexpo.Repository;

import com.amine.digiexpo.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    Optional<Volunteer> findByUsername(String username);
    Optional<Volunteer> findByEmail(String email);
    List<Volunteer> findByAssociations_Id(Long associationId);
}