package com.amine.digiexpo.Repository;

import com.amine.digiexpo.entity.Association;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssociationRepository extends JpaRepository<Association, Long> {
    Optional<Association> findByUsername(String username);
    Optional<Association> findByEmail(String email);
}