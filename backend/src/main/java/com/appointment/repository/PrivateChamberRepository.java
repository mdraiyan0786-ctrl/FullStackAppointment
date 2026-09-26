package com.appointment.repository;

import com.appointment.entity.PrivateChamber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.authentication.jaas.JaasPasswordCallbackHandler;

import java.util.List;
import java.util.Optional;

public interface PrivateChamberRepository extends JpaRepository<PrivateChamber,Long> {

    List<PrivateChamber> findByDoctorId(Long doctorId);

    Optional<PrivateChamber> findByIdAndDoctorId(
            Long id,
            Long doctorId
    );
}
