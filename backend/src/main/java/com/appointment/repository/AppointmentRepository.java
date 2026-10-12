package com.appointment.repository;

import com.appointment.entity.Appointment;
import com.appointment.entity.StoreDoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    
    List<Appointment> findByUserId(Long userId);

    long countByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatus(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            String status
    );

    @Query("""
    SELECT COUNT(a)
    FROM Appointment a
    WHERE a.doctor.id = :doctorId
    AND a.appointmentDate = :date
    AND a.appointmentTime = :time
    AND a.status = 'BOOKED'
    """)
    long countBookedAppointments(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("time") LocalTime time
    );

    boolean existsByUserIdAndDoctorIdAndAppointmentDateAndStatus(
            Long userId,
            Long doctorId,
            LocalDate appointmentDate,
            String status
    );

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByUserIdAndStatus(
            Long userId,
            String status
    );

    boolean existsByDoctorIdAndUserId(
            Long doctorId,
            Long userId
    );

    List<Appointment> findByDoctorIdAndMedicalStoreId(
            Long doctorId,
            Long medicalStoreId
    );



    @Query("""
    SELECT COUNT(a)
    FROM Appointment a
    WHERE a.medicalStore.id = :storeId
      AND a.doctor.id = :doctorId
      AND a.appointmentDate = :date
      AND a.status IN ('BOOKED', 'COMPLETED', 'ABSENT')
""")
    long countBookedStoreAppointments(
            @Param("storeId") Long storeId,
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date);


    @Query("""
    SELECT COALESCE(MAX(a.queueNumber), 0)
    FROM Appointment a
    WHERE a.medicalStore.id = :storeId
      AND a.doctor.id = :doctorId
      AND a.appointmentDate = :date
""")
    Integer findMaxQueueNumber(
            @Param("storeId") Long storeId,
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date
    );


    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT s
    FROM StoreDoctorSchedule s
    WHERE s.medicalStore.id = :storeId
      AND s.doctor.id = :doctorId
      AND s.dayOfWeek = :day
""")
    Optional<StoreDoctorSchedule> findScheduleForBooking(
            @Param("storeId") Long storeId,
            @Param("doctorId") Long doctorId,
            @Param("day") DayOfWeek day
    );


}
