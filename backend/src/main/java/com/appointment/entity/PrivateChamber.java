package com.appointment.entity;

import jakarta.persistence.*;

@Entity
@Table(name="private_chambers")
public class PrivateChamber {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false,length = 500)
    private String address;
    @Column(nullable = false)
    private String phone;
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    public PrivateChamber(Long id, String name, String address, String phone, Doctor doctor) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.doctor = doctor;
    }

    public PrivateChamber() {
    }

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

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }
}
