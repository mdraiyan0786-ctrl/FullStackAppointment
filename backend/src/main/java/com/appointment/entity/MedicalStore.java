package com.appointment.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medical_stores")
public class MedicalStore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // STORE DETAILS
    // =========================

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String phone;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String openingTime;

    @Column(nullable = false)
    private String closingTime;

    // =========================
    // STORE ADMIN
    // =========================

    @OneToOne
    @JoinColumn(name = "admin_id", nullable = false, unique = true)
    private User admin;

    // =========================
    // APPROVAL
    // =========================

    @Column(nullable = false)
    private String status;

    // =========================
    // CONSTRUCTORS
    // =========================

    public MedicalStore() {
    }

    public MedicalStore(Long id, String name, String address, String phone,
                        String description, String openingTime, String closingTime,
                        User admin, String status) {

        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.description = description;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.admin = admin;
        this.status = status;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOpeningTime() {
        return openingTime;
    }

    public void setOpeningTime(String openingTime) {
        this.openingTime = openingTime;
    }

    public String getClosingTime() {
        return closingTime;
    }

    public void setClosingTime(String closingTime) {
        this.closingTime = closingTime;
    }

    public User getAdmin() {
        return admin;
    }

    public void setAdmin(User admin) {
        this.admin = admin;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}