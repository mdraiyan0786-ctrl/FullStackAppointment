
package com.appointment.service;

import com.appointment.entity.Doctor;
import com.appointment.entity.DoctorStoreRequest;
import com.appointment.entity.MedicalStore;
import com.appointment.entity.StoreDoctorSchedule;
import com.appointment.repository.DoctorRepository;
import com.appointment.repository.DoctorStoreRequestRepository;
import com.appointment.repository.MedicalStoreRepository;
import com.appointment.repository.StoreDoctorScheduleRepository;
import com.appointment.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Service
public class StoreDoctorScheduleService {

    private final StoreDoctorScheduleRepository scheduleRepository;
    private final MedicalStoreRepository medicalStoreRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorStoreRequestRepository doctorStoreRequestRepository;
    private final UserRepository userRepository;

    public StoreDoctorScheduleService(
            StoreDoctorScheduleRepository scheduleRepository,
            MedicalStoreRepository medicalStoreRepository,
            DoctorRepository doctorRepository,
            DoctorStoreRequestRepository doctorStoreRequestRepository,
            UserRepository userRepository) {

        this.scheduleRepository = scheduleRepository;
        this.medicalStoreRepository = medicalStoreRepository;
        this.doctorRepository = doctorRepository;
        this.doctorStoreRequestRepository = doctorStoreRequestRepository;
        this.userRepository = userRepository;
    }

    // Get all schedules for a medical store
    public List<StoreDoctorSchedule> getStoreSchedules(
            Long storeId, String adminEmail) {

        MedicalStore store = getAuthorizedStore(storeId, adminEmail);

        return scheduleRepository.findByMedicalStoreId(store.getId());
    }

    // Get schedules for a particular doctor at a store
    public List<StoreDoctorSchedule> getDoctorSchedules(
            Long storeId, Long doctorId, String adminEmail) {

        MedicalStore store = getAuthorizedStore(storeId, adminEmail);

        return scheduleRepository.findByMedicalStoreIdAndDoctorId(
                store.getId(), doctorId);
    }

    // Add a schedule with a maximum patient capacity
    @Transactional
    public StoreDoctorSchedule addSchedule(
            Long storeId,
            Long doctorId,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            LocalTime endTime,
            Integer maxPatients,
            String adminEmail) {

        MedicalStore store = getAuthorizedStore(storeId, adminEmail);

        if (dayOfWeek == null || startTime == null || endTime == null) {
            throw new IllegalArgumentException(
                    "Day, start time, and end time are required.");
        }

        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException(
                    "Start time must be earlier than end time.");
        }

        if (maxPatients == null || maxPatients <= 0) {
            throw new IllegalArgumentException(
                    "Maximum patients must be greater than zero.");
        }

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Doctor not found."));

        DoctorStoreRequest request =
                doctorStoreRequestRepository
                        .findByDoctorIdAndMedicalStoreId(
                                doctorId, store.getId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Doctor has not requested to work at this store."));

        if (!"APPROVED".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException(
                    "Only approved doctors can be scheduled.");
        }

        List<StoreDoctorSchedule> existing =
                scheduleRepository.findByMedicalStoreIdAndDoctorId(
                        store.getId(), doctorId);

        boolean duplicate = existing.stream().anyMatch(schedule ->
                schedule.getDayOfWeek() == dayOfWeek);

        if (duplicate) {
            throw new IllegalArgumentException(
                    "A schedule already exists for this doctor on that day. "
                            + "Remove it before adding another.");
        }

        StoreDoctorSchedule schedule = new StoreDoctorSchedule();

        schedule.setMedicalStore(store);
        schedule.setDoctor(doctor);
        schedule.setDayOfWeek(dayOfWeek);
        schedule.setStartTime(startTime);
        schedule.setEndTime(endTime);
        schedule.setMaxPatients(maxPatients);

        return scheduleRepository.save(schedule);
    }

    // Delete a schedule
    @Transactional
    public void deleteSchedule(
            Long storeId, Long scheduleId, String adminEmail) {

        MedicalStore store = getAuthorizedStore(storeId, adminEmail);

        StoreDoctorSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Schedule not found."));

        if (!schedule.getMedicalStore().getId().equals(store.getId())) {
            throw new IllegalArgumentException(
                    "You cannot delete a schedule belonging to another store.");
        }

        scheduleRepository.delete(schedule);
    }

    // Verify that the logged-in user owns this medical store
    private MedicalStore getAuthorizedStore(
            Long storeId, String adminEmail) {

        var admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Store admin not found."));

        if (!"STORE_ADMIN".equalsIgnoreCase(admin.getRole())) {
            throw new IllegalArgumentException(
                    "Only store admins can manage schedules.");
        }

        MedicalStore store = medicalStoreRepository.findById(storeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Medical store not found."));

        if (store.getAdmin() == null
                || !store.getAdmin().getId().equals(admin.getId())) {
            throw new IllegalArgumentException(
                    "You can only manage schedules for your own store.");
        }

        return store;
    }
}
