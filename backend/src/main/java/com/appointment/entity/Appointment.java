package com.appointment.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    private Integer age;

    private String gender;

    private String phone;

    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    private String status;

    // =========================
    // PATIENT
    // =========================

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // =========================
    // DOCTOR
    // =========================

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;


    @ManyToOne
    @JoinColumn(name = "medical_store_id")
    private MedicalStore medicalStore;

    // =========================
    // PRESCRIPTION
    // =========================

    @Column(columnDefinition = "TEXT")
    private String prescriptionText;

    private String prescriptionFileUrl;

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    // =========================
    // PRESCRIPTION GETTERS/SETTERS
    // =========================

    public String getPrescriptionText() {
        return prescriptionText;
    }

    public void setPrescriptionText(String prescriptionText) {
        this.prescriptionText = prescriptionText;
    }

    public String getPrescriptionFileUrl() {
        return prescriptionFileUrl;
    }

    public void setPrescriptionFileUrl(String prescriptionFileUrl) {
        this.prescriptionFileUrl = prescriptionFileUrl;
    }

    public MedicalStore getMedicalStore() {
        return medicalStore;
    }

    public void setMedicalStore(MedicalStore medicalStore) {
        this.medicalStore = medicalStore;
    }
}