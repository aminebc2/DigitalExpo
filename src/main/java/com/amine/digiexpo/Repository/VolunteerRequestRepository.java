package com.amine.digiexpo.Repository;

import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.entity.VolunteerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRequestRepository extends JpaRepository<VolunteerRequest, Long> {
    List<VolunteerRequest> findByAssociationId(Long associationId);
    List<VolunteerRequest> findByVolunteerId(Long volunteerId);
    Optional<VolunteerRequest> findByVolunteerAndAssociation(Volunteer volunteer, Association association);
    /*List<VolunteerRequest> findByApprovedFalse(); */// Pour Admin
}