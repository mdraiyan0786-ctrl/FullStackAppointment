package com.appointment.entity;

import com.appointment.repository.AppointmentRepository;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "doctor_reviews",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"appointment_id"}
                )
        }
)
public class DoctorReview{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // ==========================================
    // PATIENT
    // ==========================================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ==========================================
    // DOCTOR
    // ==========================================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    // ==========================================
    // APPOINTMENT
    // ==========================================

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    // ==========================================
    // RATING
    // ==========================================
    @Column(nullable = false)
    private Integer rating;

    // ==========================================
    // REVIEW
    // ==========================================
    @Column(length = 1000)
    private String comment;

    // ==========================================
    // CREATED AT
    // ==========================================
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ==========================================
    // GETTERS / SETTERS
    // ==========================================
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
