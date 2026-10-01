package com.appointment.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctor_notifications")
public class DoctorNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;


    // ==========================================
    // CONSTRUCTORS
    // ==========================================

    public DoctorNotification() {
    }


    public DoctorNotification(
            Long id,
            String message,
            boolean isRead,
            LocalDateTime createdAt,
            Doctor doctor) {

        this.id = id;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.doctor = doctor;
    }


    // ==========================================
    // PRE PERSIST
    // ==========================================

    @PrePersist
    public void prePersist() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
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


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }
}