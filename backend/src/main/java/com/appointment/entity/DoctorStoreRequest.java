package com.appointment.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "doctor_store_requests",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"doctor_id", "medical_store_id"}
                )
        }
)
public class DoctorStoreRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // DOCTOR
    // =========================

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // =========================
    // MEDICAL STORE
    // =========================

    @ManyToOne
    @JoinColumn(name = "medical_store_id", nullable = false)
    private MedicalStore medicalStore;

    // =========================
    // REQUEST STATUS
    // =========================

    @Column(nullable = false)
    private String status;

    // =========================
    // REQUEST DATE
    // =========================

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    // =========================
    // CONSTRUCTORS
    // =========================

    public DoctorStoreRequest() {
    }

    public DoctorStoreRequest(
            Long id,
            Doctor doctor,
            MedicalStore medicalStore,
            String status,
            LocalDateTime requestedAt) {

        this.id = id;
        this.doctor = doctor;
        this.medicalStore = medicalStore;
        this.status = status;
        this.requestedAt = requestedAt;
    }

    // =========================
    // PRE PERSIST
    // =========================

    @PrePersist
    public void prePersist() {
        if (requestedAt == null) {
            requestedAt = LocalDateTime.now();
        }
    }

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public MedicalStore getMedicalStore() {
        return medicalStore;
    }

    public void setMedicalStore(MedicalStore medicalStore) {
        this.medicalStore = medicalStore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }
}