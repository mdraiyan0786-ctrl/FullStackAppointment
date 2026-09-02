package com.appointment.entity;

import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "store_doctor_schedules")
public class StoreDoctorSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // MEDICAL STORE
    // ==========================================

    @ManyToOne
    @JoinColumn(name = "medical_store_id", nullable = false)
    private MedicalStore medicalStore;


    // ==========================================
    // DOCTOR
    // ==========================================

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;


    // ==========================================
    // DAY OF WEEK
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek;


    // ==========================================
    // START TIME
    // ==========================================

    @Column(nullable = false)
    private LocalTime startTime;


    // ==========================================
    // END TIME
    // ==========================================

    @Column(nullable = false)
    private LocalTime endTime;


    // ==========================================
    // CONSTRUCTORS
    // ==========================================

    public StoreDoctorSchedule() {
    }


    public StoreDoctorSchedule(
            Long id,
            MedicalStore medicalStore,
            Doctor doctor,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            LocalTime endTime) {

        this.id = id;
        this.medicalStore = medicalStore;
        this.doctor = doctor;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public MedicalStore getMedicalStore() {
        return medicalStore;
    }

    public void setMedicalStore(MedicalStore medicalStore) {
        this.medicalStore = medicalStore;
    }


    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }


    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }


    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }


    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}